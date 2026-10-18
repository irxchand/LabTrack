import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { inventoryApi } from '../api/inventory.api';
import { custodyApi } from '../api/custody.api';
import { accountabilityApi } from '../api/accountability.api';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';
import { isMentorOfProject, isFacultyLeadOfProject } from '../utils/facultyAuth';

export const LAB_FACILITIES = [
  {
    id: 'AIML',
    name: 'AIML LAB',
    room: 'Lab 1 - AI',
    subTitle: 'Room 402 • Dept. of AI & Data Science',
    type: 'Core AI & Vision Systems',
  },
  {
    id: 'IOT',
    name: 'IOT LAB',
    room: 'Lab 2 - IoT',
    subTitle: 'Room 305 • Connected Sensors & Edge MCU',
    type: 'IoT & Telemetry Depot',
  },
  {
    id: 'EMBEDDED',
    name: 'EMBEDDED LAB',
    room: 'Lab 3 - Embedded',
    subTitle: 'Room 214 • Robotics & Microcontrollers',
    type: 'Robotics & Control Racks',
  },
  {
    id: 'ALL',
    name: 'ALL LABS',
    room: 'All Labs',
    subTitle: 'Central Hardware Depot • Integrated Overview',
    type: 'Unified Registry',
  },
];

const LabDataContext = createContext(null);

export function LabDataProvider({ children }) {
  const { addToast } = useNotification();
  const { currentUser } = useAuth();

  const [selectedFacility, setSelectedFacility] = useState(() => {
    try {
      return localStorage.getItem('labtrack_active_facility') || 'AIML LAB';
    } catch {
      return 'AIML LAB';
    }
  });

  const changeFacility = (facility) => {
    setSelectedFacility(facility);
    try {
      localStorage.setItem('labtrack_active_facility', facility);
    } catch (e) {
      console.error('Failed to save selected facility:', e);
    }
  };

  const [inventory, setInventory] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [requisitions, setRequisitions] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [defects, setDefects] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reliabilityData, setReliabilityData] = useState(null);
  const [incidentLedger, setIncidentLedger] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Requisition basket state for batch project requests (persisted in localStorage)
  const [basket, setBasket] = useState(() => {
    try {
      const saved = localStorage.getItem('labtrack_requisition_basket');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isBasketOpen, setIsBasketOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('labtrack_requisition_basket', JSON.stringify(basket));
    } catch (e) {
      console.error('Failed to persist basket to localStorage:', e);
    }
  }, [basket]);

  // Load all initial data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [invRes, loansRes, reqsRes, resvRes, defRes, audRes, prjRes, relRes, incRes] = await Promise.all([
        inventoryApi.getAll(),
        custodyApi.getActiveLoans(),
        custodyApi.getRequisitions(),
        custodyApi.getReservations(),
        accountabilityApi.getDefects(),
        accountabilityApi.getAuditLogs(),
        accountabilityApi.getProjects(),
        accountabilityApi.getStudentReliability(currentUser?.prn || '202401048'),
        accountabilityApi.getIncidentLedger(),
      ]);

      setInventory(invRes.data);
      setActiveLoans(loansRes.data);
      setRequisitions(reqsRes.data);
      setReservations(resvRes.data);
      setDefects(defRes.data);
      setAuditLogs(audRes.data);
      setProjects(prjRes.data);
      setReliabilityData(relRes.data);
      setIncidentLedger(incRes.data);
    } catch (err) {
      console.error('Failed to load lab data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.prn]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Basket methods
  const addToBasket = (item, quantity = 1) => {
    setBasket((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsBasketOpen(true);
    addToast({
      title: 'Item Added to Requisition Basket',
      message: `${item.nomenclature} staged in basket.`,
      type: 'info',
    });
  };

  const removeFromBasket = (itemId) => {
    setBasket((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateBasketQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromBasket(itemId);
      return;
    }
    setBasket((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearBasket = () => {
    setBasket([]);
  };

  // Submit batch requisition
  const submitBasketRequisition = async (technicalPurpose, targetProjectId) => {
    if (basket.length === 0) return false;
    const componentsRequested = basket.map((item) => ({
      itemId: item.id,
      nomenclature: item.nomenclature,
      quantity: item.quantity,
      type: item.classification,
    }));

    // Find the targeted project if specified, or match to current user
    const selectedProject =
      projects.find((p) => p.id === targetProjectId) ||
      projects.find((p) => p.id === currentUser?.projectId) ||
      projects[0];

    const isFaculty = currentUser?.role === 'Faculty';

    if (isFaculty && selectedProject) {
      const isLead = isFacultyLeadOfProject(selectedProject, currentUser);
      const isMentor = isMentorOfProject(selectedProject, currentUser);

      if (!isLead && !isMentor) {
        addToast({
          title: 'Allocation Restricted',
          message: selectedProject.isFacultyProject
            ? `You cannot allocate hardware to another professor's research facility. "${selectedProject.title}" is directed by ${selectedProject.facultyLead || selectedProject.mentorName}.`
            : `Faculty can only allocate hardware to student teams under their mentorship wing. "${selectedProject.title}" is mentored by ${selectedProject.mentorName || 'another faculty member'}.`,
          type: 'danger',
        });
        return false;
      }
    }

    const res = await custodyApi.submitRequisition({
      studentPrn: isFaculty ? (selectedProject?.teamLeaderPrn || currentUser?.prn || 'FAC-AI-019') : (currentUser?.prn || '202401048'),
      studentName: isFaculty ? (selectedProject?.members?.[0]?.name || currentUser?.name || 'Dr. Anjali Dalvi') : (currentUser?.name || 'Rahul Sharma'),
      projectId: selectedProject?.id || currentUser?.projectId || 'PRJ-AIML-08',
      courseCode: selectedProject?.courseCode || currentUser?.courseCode || 'DCDS-SY-AIML',
      mentorId: selectedProject?.mentorId || currentUser?.mentorId || 'FAC-AI-019',
      mentorName: selectedProject?.mentorName || currentUser?.name || 'Dr. Anjali Dalvi',
      isFacultyProject: Boolean(selectedProject?.isFacultyProject || isFaculty),
      technicalPurpose: isFaculty ? `[Faculty Endorsement] ${technicalPurpose}` : technicalPurpose,
      componentsRequested,
    });

    if (res.ok) {
      if (isFaculty && selectedProject) {
        // Faculty auto-endorses requests they create for their project or mentored teams
        await custodyApi.approveRequisition(res.data.id, `Faculty Direct Authorization by ${currentUser?.name || 'Mentor'}`);

        // Direct-allocate: immediately bind staged kit components into active loans and project allocation roster
        const todayStr = new Date().toISOString().split('T')[0];
        const dueDateStr = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const newLoans = basket.map((item, idx) => ({
          id: `LN-FAC-${Date.now().toString().slice(-5)}-${idx}`,
          assetTag: item.assetTag || item.id,
          nomenclature: item.nomenclature || 'Hardware Component',
          studentPrn: selectedProject.isFacultyProject ? (currentUser?.prn || 'FAC-AI-019') : (selectedProject.teamLeaderPrn || '202401048'),
          studentName: selectedProject.isFacultyProject ? (currentUser?.name || 'Dr. Anjali Dalvi') : (selectedProject.members?.[0]?.name || 'Project Team'),
          projectId: selectedProject.id,
          checkoutDate: todayStr,
          dueDate: dueDateStr,
          daysRemaining: 45,
          status: 'Active',
          allocatedByFaculty: currentUser?.name || 'Dr. Anjali Dalvi',
          notes: technicalPurpose || (selectedProject.isFacultyProject ? 'Faculty laboratory research deployment' : 'Allocated by faculty mentor for capstone sprint'),
        }));
        setActiveLoans((prev) => [...newLoans, ...prev]);

        const newAllocatedItems = basket.map((item) => ({
          assetTag: item.assetTag || item.id,
          nomenclature: item.nomenclature || 'Hardware Component',
          checkedOut: todayStr,
          due: dueDateStr,
          notes: technicalPurpose || 'Directly allocated by faculty mentor',
          allocatedBy: currentUser?.name || 'Dr. Anjali Dalvi',
          allocatedByRole: 'Faculty',
        }));

        setProjects((prev) =>
          prev.map((p) => {
            if (p.id === selectedProject.id) {
              return {
                ...p,
                allocatedItems: [...(p.allocatedItems || []), ...newAllocatedItems],
                currentAllocatedCount: (p.currentAllocatedCount || 0) + basket.reduce((acc, i) => acc + (i.quantity || 1), 0),
              };
            }
            return p;
          })
        );

        setInventory((prev) =>
          prev.map((inv) => {
            const match = basket.find((b) => b.id === inv.id || b.assetTag === inv.assetTag);
            if (match) {
              return {
                ...inv,
                availableStock: Math.max(0, (inv.availableStock || 1) - (match.quantity || 1)),
              };
            }
            return inv;
          })
        );
      }

      clearBasket();
      setIsBasketOpen(false);
      await loadData();
      addToast({
        title: isFaculty ? 'Hardware Directly Allocated' : 'Requisition Submitted',
        message: isFaculty
          ? `Components directly allocated and active in "${selectedProject?.title || selectedProject?.id}".`
          : `Order #${res.data.id} bound to ${selectedProject?.id || 'Project'}. Forwarded to ${selectedProject?.mentorName || 'Faculty'} for endorsement.`,
        type: 'success',
      });
      return true;
    }
    return false;
  };

  // Direct Hardware Allocation by Faculty to Project (Faculty's own lab or mentored team)
  const allocateHardwareToProject = async ({ projectId, itemId, quantity = 1, notes = '' }) => {
    const targetProject = projects.find((p) => p.id === projectId);
    const invItem = inventory.find((i) => i.id === itemId || i.assetTag === itemId);

    if (!targetProject) {
      addToast({
        title: 'Allocation Failed',
        message: `Project ${projectId} not found in institutional repository.`,
        type: 'danger',
      });
      return false;
    }

    const isFacultyUser = currentUser?.role === 'Faculty';
    if (isFacultyUser) {
      const isLead = isFacultyLeadOfProject(targetProject, currentUser);
      const isMentor = isMentorOfProject(targetProject, currentUser);

      if (!isLead && !isMentor) {
        addToast({
          title: 'Allocation Prohibited',
          message: targetProject.isFacultyProject
            ? `You cannot allocate hardware to another faculty member's research lab. "${targetProject.title}" is directed by ${targetProject.facultyLead || targetProject.mentorName}.`
            : `Faculty can only allocate hardware to student teams under their mentorship wing. "${targetProject.title}" is mentored by ${targetProject.mentorName || 'another guide'}.`,
          type: 'danger',
        });
        return false;
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const dueDateStr = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newAllocatedItem = {
      assetTag: invItem?.assetTag || itemId,
      nomenclature: invItem?.nomenclature || 'Hardware Component',
      checkedOut: todayStr,
      due: dueDateStr,
      notes: notes || 'Directly allocated by faculty mentor',
      allocatedBy: currentUser?.name || 'Dr. Anjali Dalvi',
      allocatedByRole: currentUser?.role || 'Faculty',
    };

    // Update target project
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            allocatedItems: [...(p.allocatedItems || []), newAllocatedItem],
            currentAllocatedCount: (p.currentAllocatedCount || 0) + quantity,
          };
        }
        return p;
      })
    );

    // Add active loan
    const newLoan = {
      id: `LN-FAC-${Date.now().toString().slice(-5)}`,
      assetTag: invItem?.assetTag || itemId,
      nomenclature: invItem?.nomenclature || 'Hardware Component',
      studentPrn: targetProject.isFacultyProject ? (currentUser?.prn || 'FAC-AI-019') : (targetProject.teamLeaderPrn || '202401048'),
      studentName: targetProject.isFacultyProject
        ? (currentUser?.name || 'Dr. Anjali Dalvi')
        : (targetProject.members?.[0]?.name || 'Project Team'),
      projectId: targetProject.id,
      checkoutDate: todayStr,
      dueDate: dueDateStr,
      daysRemaining: 45,
      status: 'Active',
      allocatedByFaculty: currentUser?.name || 'Dr. Anjali Dalvi',
      notes: notes || 'Faculty direct allocation',
    };
    setActiveLoans((prev) => [newLoan, ...prev]);

    // Decrement available inventory stock
    if (invItem) {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === invItem.id
            ? { ...item, availableStock: Math.max(0, (item.availableStock || 1) - quantity) }
            : item
        )
      );
    }

    // Record institutional audit log
    const newAudit = {
      id: `AUD-FAC-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      eventType: 'FACULTY_DIRECT_ALLOCATION',
      actor: currentUser?.name || 'Dr. Anjali Dalvi',
      actorRole: 'Faculty Mentor',
      assetTag: invItem?.assetTag || itemId,
      target: targetProject.title || projectId,
      details: `Directly allocated ${quantity}x ${invItem?.nomenclature || 'Hardware'} to "${targetProject.title}". Notes: ${notes || 'Academic authorization'}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    addToast({
      title: 'Hardware Allocated',
      message: `${quantity}x ${invItem?.nomenclature || 'Component'} allocated to "${targetProject.title}".`,
      type: 'success',
    });

    return true;
  };

  // Approval methods
  const approveRequisition = async (reqId, notes) => {
    const res = await custodyApi.approveRequisition(
      reqId,
      notes,
      currentUser?.name || 'Dr. Anjali Dalvi',
      currentUser?.prn || 'FAC-AI-019'
    );
    if (res.ok) {
      await loadData();
      addToast({
        title: 'Requisition Endorsed',
        message: `Requisition ${reqId} approved. Forwarded to Lab Assistant counter for staging.`,
        type: 'success',
      });
    }
  };

  const rejectRequisition = async (reqId, reason) => {
    const res = await custodyApi.rejectRequisition(
      reqId,
      reason,
      currentUser?.name || 'Dr. Anjali Dalvi',
      currentUser?.prn || 'FAC-AI-019'
    );
    if (res.ok) {
      await loadData();
      addToast({
        title: 'Requisition Rejected',
        message: `Requisition ${reqId} rejected with note recorded in audit log.`,
        type: 'warning',
      });
    }
  };

  const modifyRequisitionQuantity = async (reqId, itemIndex, newQty) => {
    const res = await custodyApi.modifyQuantity(reqId, itemIndex, newQty);
    if (res.ok) {
      await loadData();
      addToast({
        title: 'Allocation Adjusted',
        message: `Quantity modified to ${newQty} for requisition ${reqId}.`,
        type: 'info',
      });
    }
  };

  const stageRequisitionForPickup = async (reqId, notes) => {
    const res = await custodyApi.stageForCounterPickup(reqId, notes);
    if (res.ok) {
      await loadData();
      addToast({
        title: 'Staged for Pickup',
        message: `Requisition ${reqId} marked ready for counter pickup.`,
        type: 'success',
      });
    }
  };

  // Extension
  const requestExtension = async (loanId, days, reason) => {
    const res = await custodyApi.requestExtension(loanId, days, reason);
    if (res.ok) {
      await loadData();
      addToast({
        title: 'Extension Approved',
        message: `Loan deadline extended by ${days} days under department academic grace policy.`,
        type: 'success',
      });
      return true;
    }
    return false;
  };

  // Dispatch & Returns
  const executeDispatch = async (payload) => {
    const res = await custodyApi.executeDispatch(payload);
    if (res.ok) {
      // update item status in inventory
      await inventoryApi.updateStockStatus(payload.assetTag, 'Allocated', {
        prn: payload.studentPrn,
        name: payload.studentName,
        projectId: payload.projectId,
        dueDate: payload.dueDate || '2026-10-29',
      });
      await loadData();
      addToast({
        title: 'Hardware Dispatched',
        message: `Asset ${payload.assetTag} checked out to PRN ${payload.studentPrn}. Transaction committed.`,
        type: 'success',
      });
      return true;
    }
    return false;
  };

  const executeReturn = async (loanId, conditionChecklist, returnType, defectDetails) => {
    const res = await custodyApi.executeCheckinReturn(loanId, conditionChecklist, returnType, defectDetails);
    if (res.ok) {
      if (returnType === 'defect' && res.data.loan) {
        // Log defect
        await accountabilityApi.logDefect({
          assetTag: res.data.loan.assetTag,
          nomenclature: res.data.loan.nomenclature,
          studentPrn: res.data.loan.borrowerPrn,
          projectId: res.data.loan.projectId,
          severity: defectDetails?.severity || 'Moderate',
          defectCategory: defectDetails?.defectCategory || 'Check-in Inspection Failure',
          conditionSummary: defectDetails?.conditionSummary || 'Hardware failed counter physical test',
          actionPlan: 'Routed to triage bench for diagnostic inspection',
        });
        await inventoryApi.updateStockStatus(res.data.loan.assetTag, 'Maintenance', null, {
          event: 'Returned with Defect',
          actor: currentUser?.name || 'Ramesh Patil (Lab Assistant)',
          prn: res.data.loan.borrowerPrn,
          condition: 'Maintenance Required',
          notes: defectDetails?.conditionSummary || 'Failed return inspection; routed to triage bench',
        });
      } else if (res.data.loan) {
        // Clean return restock - reset hardware state & increment available stock
        await inventoryApi.updateStockStatus(res.data.loan.assetTag, 'Available', null, {
          event: 'Restocked to Inventory',
          actor: currentUser?.name || 'Ramesh Patil (Lab Assistant)',
          prn: res.data.loan.borrowerPrn,
          condition: 'Operational',
          notes: 'Multi-point inspection passed. Hardware sanitized, reset, and restocked to shelf.',
        });
      }

      await loadData();
      addToast({
        title: returnType === 'clean' ? 'Hardware Verified & Stock Reset' : 'Defect Logged on Return',
        message: returnType === 'clean'
          ? `Asset ${res.data.loan?.assetTag || 'unit'} certified operational. Available stock incremented in inventory.`
          : 'Asset routed to maintenance bench and defect recorded against student project.',
        type: returnType === 'clean' ? 'success' : 'warning',
      });
      return true;
    }
    return false;
  };

  // Waitlist / Reservations
  const joinWaitlist = async (item) => {
    const res = await custodyApi.joinReservationQueue(item);
    if (res.ok) {
      await loadData();
      addToast({
        title: 'Added to FIFO Waitlist',
        message: `Position #${res.data.queuePosition} reserved for ${item.nomenclature}.`,
        type: 'info',
      });
    }
  };

  const leaveWaitlist = async (resId) => {
    const res = await custodyApi.leaveReservationQueue(resId);
    if (res.ok) {
      await loadData();
      addToast({
        title: 'Waitlist Withdrawn',
        message: 'Reservation cancelled from backlog.',
        type: 'info',
      });
    }
  };

  // Defect actions
  const updateDefectStatus = async (defectId, status, actionPlan) => {
    const res = await accountabilityApi.updateRepairStatus(defectId, status, actionPlan);
    if (res.ok) {
      if (status === 'Repaired') {
        const item = defects.find((d) => d.id === defectId);
          await inventoryApi.updateStockStatus(item.assetTag, 'Available', null, {
            event: 'Bench Repair & Restock',
            actor: currentUser?.name || 'Ramesh Patil (Lab Assistant)',
            prn: item.associatedPrn || 'Bench Tech',
            condition: 'Operational (Repaired)',
            notes: actionPlan || 'Diagnostic verification passed at bench. Hardware certified operational and restocked to shelf.',
          });
      }
      await loadData();
      addToast({
        title: status === 'Repaired' ? 'Hardware Restocked to Inventory' : 'Defect Status Updated',
        message: status === 'Repaired'
          ? `Asset verified operational and returned to active shelf inventory.`
          : `Ticket ${defectId} updated to ${status}.`,
        type: status === 'Repaired' ? 'success' : 'info',
      });
    }
  };

  const retireAsset = async (defectId) => {
    const res = await accountabilityApi.retireAsset(defectId);
    if (res.ok) {
      await loadData();
      addToast({
        title: 'Asset Permanently Retired',
        message: `Hardware decommissioned from active institutional registry.`,
        type: 'warning',
      });
    }
  };

  // Report Defect from Active Loan
  const reportDefect = async (defectData) => {
    const newDefect = {
      id: `DEF-2026-${String(defects.length + 101).padStart(3, '0')}`,
      assetTag: defectData.assetTag,
      nomenclature: defectData.nomenclature,
      associatedPrn: currentUser?.prn || '202401048',
      associatedProject: defectData.projectId || 'PRJ-AIML-2026-08',
      severity: defectData.severity || 'Moderate',
      defectCategory: defectData.defectCategory || 'Component Fault',
      conditionSummary: defectData.description || 'Reported by borrower during active loan',
      reportedDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      repairStatus: 'Under Inspection',
      resolutionPlan: 'Staged for technician bench triage',
    };
    setDefects((prev) => [newDefect, ...prev]);
    addToast({
      title: 'Fault Report Submitted',
      message: `Defect ticket ${newDefect.id} logged for technician bench inspection.`,
      type: 'warning',
    });
    return newDefect;
  };

  // Inventory additions
  const addNewInventoryItem = async (newItem) => {
    const res = await inventoryApi.addItem(newItem);
    if (res.ok) {
      await loadData();
      addToast({
        title: 'Asset Registered',
        message: `Hardware ${newItem.nomenclature} (${newItem.assetTag}) cataloged into ${newItem.coordinates}.`,
        type: 'success',
      });
      return true;
    }
    return false;
  };

  // Create Project Group
  const createProject = async (projectData) => {
    const res = await accountabilityApi.createProject(projectData);
    if (res.ok) {
      await loadData();
      addToast({
        title: 'Project Group Registered',
        message: `Group "${projectData.title}" registered with ${projectData.members.length} members.`,
        type: 'success',
      });
      return res.data;
    }
    return null;
  };

  // Rename / Update Project Title
  const updateProjectTitle = async (projectId, newTitle) => {
    if (!newTitle || !newTitle.trim()) {
      addToast({
        title: 'Invalid Title',
        message: 'Project title cannot be empty.',
        type: 'warning',
      });
      return false;
    }
    const cleanTitle = newTitle.trim();
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, title: cleanTitle } : p))
    );
    const res = await accountabilityApi.updateProjectTitle(
      projectId,
      cleanTitle,
      currentUser?.name,
      currentUser?.role
    );
    if (res.ok) {
      addToast({
        title: 'Project Title Updated',
        message: `Project renamed to "${cleanTitle}".`,
        type: 'success',
      });
      return true;
    }
    return false;
  };

  return (
    <LabDataContext.Provider
      value={{
        inventory,
        activeLoans,
        requisitions,
        reservations,
        defects,
        auditLogs,
        projects,
        reliabilityData,
        incidentLedger,
        isLoading,
        refreshData: loadData,
        // Basket
        basket,
        isBasketOpen,
        setIsBasketOpen,
        addToBasket,
        removeFromBasket,
        updateBasketQuantity,
        clearBasket,
        submitBasketRequisition,
        // Workflows
        allocateHardwareToProject,
        approveRequisition,
        rejectRequisition,
        modifyRequisitionQuantity,
        stageRequisitionForPickup,
        requestExtension,
        executeDispatch,
        executeReturn,
        joinWaitlist,
        leaveWaitlist,
        updateDefectStatus,
        reportDefect,
        retireAsset,
        addNewInventoryItem,
        createProject,
        updateProjectTitle,
        // Facility State
        selectedFacility,
        setSelectedFacility: changeFacility,
        facilities: LAB_FACILITIES,
      }}
    >
      {children}
    </LabDataContext.Provider>
  );
}

export function useLabData() {
  const context = useContext(LabDataContext);
  if (!context) {
    throw new Error('useLabData must be used within a LabDataProvider');
  }
  return context;
}
