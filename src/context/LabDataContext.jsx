import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { inventoryApi } from '../api/inventory.api';
import { custodyApi } from '../api/custody.api';
import { accountabilityApi } from '../api/accountability.api';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

const LabDataContext = createContext(null);

export function LabDataProvider({ children }) {
  const { addToast } = useNotification();
  const { currentUser } = useAuth();

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

  // Requisition basket state for batch project requests
  const [basket, setBasket] = useState([]);
  const [isBasketOpen, setIsBasketOpen] = useState(false);

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
  const submitBasketRequisition = async (technicalPurpose) => {
    if (basket.length === 0) return false;
    const componentsRequested = basket.map((item) => ({
      itemId: item.id,
      nomenclature: item.nomenclature,
      quantity: item.quantity,
      type: item.classification,
    }));

    const res = await custodyApi.submitRequisition({
      studentPrn: currentUser?.prn || '202401048',
      studentName: currentUser?.name || 'Aryan Sharma',
      projectId: currentUser?.projectId || 'PRJ-AIML-08',
      courseCode: currentUser?.courseCode || 'DCDS-SY-AIML',
      mentorId: currentUser?.mentorId || 'FAC-AI-019',
      mentorName: currentUser?.mentorName || 'Prof. Sneha Kulkarni',
      technicalPurpose,
      componentsRequested,
    });

    if (res.ok) {
      clearBasket();
      setIsBasketOpen(false);
      await loadData();
      addToast({
        title: 'Requisition Submitted',
        message: `Order #${res.data.id} has been transmitted to faculty mentor for endorsement.`,
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
        retireAsset,
        addNewInventoryItem,
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
