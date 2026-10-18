import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { inventoryApi } from '../api/inventory.api';
import { custodyApi } from '../api/custody.api';
import { accountabilityApi } from '../api/accountability.api';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

export const DEPARTMENTS = [
  {
    id: 'ALL',
    code: 'ALL',
    name: 'ALL DEPARTMENTS',
    shortName: 'ALL DEPTS',
    subTitle: 'Central Hardware Depot • Cross-Department Overview',
    floor: '4th, 5th & 6th Floors',
    description: 'Central Hardware Depot • Integrated Overview across all SIT engineering labs',
  },
  {
    id: 'AIML',
    code: 'AIML',
    name: 'AIML DEPT',
    shortName: 'AIML DEPT',
    subTitle: 'Dept. of AI & Machine Learning',
    floor: '5th Floor Labs',
    description: 'Fifth Floor • Computer Vision, Deep Learning, Cloud & AI Capstone Labs',
  },
  {
    id: 'CSE',
    code: 'CSE',
    name: 'CSE DEPT',
    shortName: 'CSE DEPT',
    subTitle: 'Dept. of Computer Science & Eng.',
    floor: '4th & 5th Floor Labs',
    description: 'Fourth & Fifth Floor • Programming, Open Source, Data Structures & High Performance Labs',
  },
  {
    id: 'RA',
    code: 'RA',
    name: 'RA DEPT',
    shortName: 'RA DEPT',
    subTitle: 'Dept. of Robotics & Automation',
    floor: '6th Floor Labs',
    description: 'Sixth Floor • Mobile Robotics, Mechatronics, Actuators & LiDAR Labs',
  },
];

// Backward compatibility alias
export const LAB_FACILITIES = DEPARTMENTS;

export const getDeptFromLabId = (labId) => {
  if (!labId) return 'ALL';
  const upper = String(labId).toUpperCase();
  if (upper.endsWith('AIML') || upper.includes('AIML')) return 'AIML';
  if (upper.endsWith('CSE') || upper.includes('CSE')) return 'CSE';
  if (upper.endsWith('RA') || upper.includes('RA')) return 'RA';
  return 'ALL';
};

export const getUserDepartment = (user) => {
  if (!user) return 'AIML';
  if (user.branch) {
    const b = user.branch.toUpperCase();
    if (b.includes('AIML') || b === 'AI' || b === 'AIDS') return 'AIML';
    if (b.includes('CSE') || b === 'CS') return 'CSE';
    if (b.includes('RA') || b.includes('ROBOT')) return 'RA';
  }
  if (user.department) {
    const d = user.department.toUpperCase();
    if (d.includes('AIML') || d.includes('AI &') || d.includes('MACHINE LEARNING')) return 'AIML';
    if (d.includes('CSE') || d.includes('COMPUTER SCIENCE')) return 'CSE';
    if (d.includes('RA') || d.includes('ROBOTICS') || d.includes('AUTOMATION')) return 'RA';
  }
  if (user.prn) {
    const prn = String(user.prn);
    if (prn.length >= 8) {
      const code = prn.substring(6, 8);
      if (code === '26') return 'AIML';
      if (code === '22') return 'CSE';
      if (code === '27') return 'RA';
    }
  }
  return 'AIML';
};

export const getItemDeptStock = (item, deptCode) => {
  if (!item) return { available: 0, total: 0, depts: [] };
  const breakdown = item.labBreakdown || item.labs || [];

  const itemDepts = new Set();
  if (breakdown.length > 0) {
    breakdown.forEach((b) => {
      const dept = b.branch || getDeptFromLabId(b.lab_id);
      if (dept && dept !== 'ALL') itemDepts.add(dept);
    });
  } else {
    const primaryDept = getDeptFromLabId(item.primaryLabId || item.labRoom);
    if (primaryDept && primaryDept !== 'ALL') itemDepts.add(primaryDept);
  }
  const deptsList = Array.from(itemDepts);

  if (!deptCode || deptCode === 'ALL') {
    return {
      available: item.availableStock ?? item.available ?? 0,
      total: item.totalStock ?? item.total ?? 0,
      depts: deptsList,
      isHousedInDept: true,
    };
  }

  if (breakdown.length > 0) {
    const deptLabs = breakdown.filter((b) => {
      const dept = b.branch || getDeptFromLabId(b.lab_id);
      return dept === deptCode;
    });
    const available = deptLabs.reduce((sum, b) => sum + (b.good ?? 0), 0);
    const total = deptLabs.reduce((sum, b) => sum + ((b.good ?? 0) + (b.bad ?? 0) || b.total || 0), 0);
    return {
      available,
      total,
      depts: deptsList,
      isHousedInDept: deptLabs.length > 0 && available > 0,
      labsCount: deptLabs.length,
    };
  }

  const primaryDept = getDeptFromLabId(item.primaryLabId || item.labRoom);
  const match = primaryDept === deptCode;
  return {
    available: match ? (item.availableStock ?? 0) : 0,
    total: match ? (item.totalStock ?? 0) : 0,
    depts: match ? [deptCode] : deptsList,
    isHousedInDept: match && (item.availableStock ?? 0) > 0,
  };
};

const LabDataContext = createContext(null);

export function LabDataProvider({ children }) {
  const { addToast } = useNotification();
  const { currentUser } = useAuth();

  const userDepartment = getUserDepartment(currentUser);
  const isStudent = currentUser?.role === 'Student';

  const [selectedDepartment, setSelectedDepartment] = useState(() => {
    try {
      return localStorage.getItem('labtrack_active_dept') || (isStudent ? userDepartment : 'ALL');
    } catch {
      return isStudent ? userDepartment : 'ALL';
    }
  });

  // Automatically keep student view focused on their home department
  useEffect(() => {
    if (isStudent && userDepartment) {
      setSelectedDepartment(userDepartment);
      try {
        localStorage.setItem('labtrack_active_dept', userDepartment);
      } catch (e) {
        console.error('Failed to save selected dept:', e);
      }
    }
  }, [currentUser?.prn, isStudent, userDepartment]);

  const changeDepartment = (deptCode) => {
    setSelectedDepartment(deptCode);
    try {
      localStorage.setItem('labtrack_active_dept', deptCode);
      localStorage.setItem('labtrack_active_facility', deptCode === 'ALL' ? 'ALL DEPTS' : `${deptCode} DEPT`);
    } catch (e) {
      console.error('Failed to save selected dept:', e);
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

  // Basket methods with Departmental Issue Governance
  const addToBasket = (item, quantity = 1) => {
    if (isStudent) {
      const stockInfo = getItemDeptStock(item, userDepartment);
      if (stockInfo.available <= 0) {
        addToast({
          title: 'Cross-Department Issue Prohibited',
          message: `${item.nomenclature} is not housed in ${userDepartment} department labs. SIT policy strictly restricts student requisitions to their enrolled department labs.`,
          type: 'warning',
        });
        return false;
      }
    }

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
      message: `${item.nomenclature} staged in basket (${userDepartment} Dept).`,
      type: 'info',
    });
    return true;
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

    // Strict client-side departmental validation before submission
    if (isStudent) {
      const crossDeptItems = basket.filter((item) => {
        const stockInfo = getItemDeptStock(item, userDepartment);
        return stockInfo.available <= 0;
      });
      if (crossDeptItems.length > 0) {
        addToast({
          title: 'Policy Restriction: Cross-Department Hardware',
          message: `Cannot submit requisition: Contains items (${crossDeptItems.map((i) => i.nomenclature).join(', ')}) outside ${userDepartment} labs.`,
          type: 'warning',
        });
        return false;
      }
    }

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

    const res = await custodyApi.submitRequisition({
      studentPrn: currentUser?.prn || '202401048',
      studentName: currentUser?.name || 'Rahul Sharma',
      projectId: selectedProject?.id || currentUser?.projectId || 'PROJ-000001',
      courseCode: selectedProject?.courseCode || currentUser?.courseCode || 'AIML-CAPSTONE-2026',
      mentorId: selectedProject?.mentorId || currentUser?.mentorId || 'T100458',
      mentorName: selectedProject?.mentorName || currentUser?.mentorName || 'Dr. Meenakshi Sharma',
      technicalPurpose,
      componentsRequested,
    });

    if (res.ok) {
      clearBasket();
      setIsBasketOpen(false);
      await loadData();
      addToast({
        title: 'Requisition Submitted',
        message: `Order #${res.data.id} bound to ${selectedProject?.id || 'Project'}. Forwarded to ${selectedProject?.mentorName || 'Faculty'} for endorsement.`,
        type: 'success',
      });
      return true;
    }
    return false;
  };

  // Approval methods
  const approveRequisition = async (reqId, notes) => {
    const res = await custodyApi.approveRequisition(reqId, notes);
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
    const res = await custodyApi.rejectRequisition(reqId, reason);
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
        await inventoryApi.updateStockStatus(res.data.loan.assetTag, 'Maintenance', null);
      } else if (res.data.loan) {
        // Clean return restock
        await inventoryApi.updateStockStatus(res.data.loan.assetTag, 'Available', null);
      }

      await loadData();
      addToast({
        title: returnType === 'clean' ? 'Clean Return Accepted' : 'Defect Logged on Return',
        message: returnType === 'clean'
          ? 'Hardware restocked to inventory pool. FIFO waitlist queue updated.'
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
      await loadData();
      addToast({
        title: 'Defect Status Updated',
        message: `Ticket ${defectId} updated to ${status}.`,
        type: 'info',
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
        // Facility State
        // Department Registry & Scoping
        departments: DEPARTMENTS,
        selectedDepartment,
        setSelectedDepartment: changeDepartment,
        userDepartment,
        getItemDeptStock,
        // Backward compatibility
        selectedFacility: selectedDepartment === 'ALL' ? 'ALL DEPTS' : `${selectedDepartment} DEPT`,
        setSelectedFacility: (fac) => {
          const raw = String(fac).replace(' DEPT', '').replace(' LAB', '').replace('S', '').trim();
          changeDepartment(raw === 'ALL' ? 'ALL' : raw);
        },
        facilities: DEPARTMENTS,
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
