import { apiClient } from './client';
import {
  INITIAL_ACTIVE_LOANS,
  INITIAL_REQUISITIONS,
  INITIAL_RESERVATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

const CURRENT_SCHEMA_VERSION = 'v8_canonical_components_2026';
const LOANS_KEY = 'labtrack_loans_v8';
const REQ_KEY = 'labtrack_requisitions_v8';
const RES_KEY = 'labtrack_reservations_v8';
const AUDIT_KEY = 'labtrack_audit_v8';

function getStored(key, initial) {
  try {
    const version = localStorage.getItem('labtrack_schema_version');
    if (version !== CURRENT_SCHEMA_VERSION) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  } catch (e) {
    return initial;
  }
}

function saveStored(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function appendAudit(action, targetId, details, actorRole = 'Student', actorPrn = '202401048') {
  const audits = getStored(AUDIT_KEY, INITIAL_AUDIT_LOGS);
  const newAudit = {
    id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    actorPrn,
    actorRole,
    actorName: actorRole === 'Student' ? 'Rahul Sharma' : actorRole === 'Faculty' ? 'Dr. Meenakshi Sharma' : actorRole === 'Lab Assistant' ? 'Ramesh Patil' : 'Dr. Sumit Kumar',
    action,
    targetId,
    details,
    checksum: `sha256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}...`,
  };
  saveStored(AUDIT_KEY, [newAudit, ...audits]);
}

export const custodyApi = {
  // LOANS
  getActiveLoans: async () => {
    return apiClient.simulatedFetch('GET_ACTIVE_LOANS', () => {
      return getStored(LOANS_KEY, INITIAL_ACTIVE_LOANS);
    });
  },

  requestExtension: async (loanId, days, reason) => {
    return apiClient.simulatedFetch('REQUEST_EXTENSION', () => {
      const loans = getStored(LOANS_KEY, INITIAL_ACTIVE_LOANS);
      const idx = loans.findIndex((l) => l.id === loanId);
      if (idx !== -1) {
        const loan = loans[idx];
        const oldDue = new Date(loan.dueDate);
        oldDue.setDate(oldDue.getDate() + Number(days));
        loan.dueDate = oldDue.toISOString().replace('T', ' ').substring(0, 19);
        loan.daysRemaining += Number(days);
        if (loan.daysRemaining > 3) {
          loan.status = 'Normal';
        }
        loan.extensionHistory.push({
          date: new Date().toISOString().substring(0, 10),
          daysGranted: days,
          reason,
          status: 'Auto-Approved Under Institutional Extension Policy',
        });
        saveStored(LOANS_KEY, loans);
        appendAudit('EXTENSION_GRANTED', loanId, `Extended loan by ${days} days: ${reason}`, 'Student', loan.borrowerPrn);
        return loan;
      }
      return null;
    });
  },

  // REQUISITIONS
  getRequisitions: async () => {
    return apiClient.simulatedFetch('GET_REQUISITIONS', () => {
      return getStored(REQ_KEY, INITIAL_REQUISITIONS);
    });
  },

  submitRequisition: async (requisitionData) => {
    return apiClient.simulatedFetch('SUBMIT_REQUISITION', () => {
      const requisitions = getStored(REQ_KEY, INITIAL_REQUISITIONS);
      const newReq = {
        id: `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        requestDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        studentPrn: requisitionData.studentPrn || '202401048',
        studentName: requisitionData.studentName || 'Aryan Sharma',
        projectId: requisitionData.projectId || 'PRJ-AIML-08',
        courseCode: requisitionData.courseCode || 'DCDS-SY-AIML',
        mentorId: requisitionData.mentorId || 'FAC-AI-019',
        mentorName: requisitionData.mentorName || 'Prof. Sneha Kulkarni',
        teamReliabilityScore: 94,
        technicalPurpose: requisitionData.technicalPurpose,
        componentsRequested: requisitionData.componentsRequested,
        status: 'Submitted',
        timeline: [
          {
            step: 'Submitted',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            actor: requisitionData.studentName || 'Aryan Sharma',
            note: 'Requisition submitted through institutional portal',
          },
        ],
        supervisorNotes: '',
        counterNotes: '',
      };
      const updated = [newReq, ...requisitions];
      saveStored(REQ_KEY, updated);
      appendAudit('REQUISITION_SUBMITTED', newReq.id, `Submitted requisition for ${requisitionData.componentsRequested.length} items`, 'Student', newReq.studentPrn);
      return newReq;
    });
  },

  approveRequisition: async (reqId, supervisorNotes = 'Approved for laboratory coursework.') => {
    return apiClient.simulatedFetch('APPROVE_REQUISITION', () => {
      const requisitions = getStored(REQ_KEY, INITIAL_REQUISITIONS);
      const idx = requisitions.findIndex((r) => r.id === reqId);
      if (idx !== -1) {
        requisitions[idx].status = 'Faculty Endorsed';
        requisitions[idx].supervisorNotes = supervisorNotes;
        requisitions[idx].timeline.push({
          step: 'Faculty Endorsed',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: 'Prof. Sneha Kulkarni (FAC-AI-019)',
          note: supervisorNotes,
        });
        saveStored(REQ_KEY, requisitions);
        appendAudit('REQUISITION_APPROVED', reqId, `Faculty endorsement: ${supervisorNotes}`, 'Faculty', 'FAC-AI-019');
        return requisitions[idx];
      }
      return null;
    });
  },

  rejectRequisition: async (reqId, reason) => {
    return apiClient.simulatedFetch('REJECT_REQUISITION', () => {
      const requisitions = getStored(REQ_KEY, INITIAL_REQUISITIONS);
      const idx = requisitions.findIndex((r) => r.id === reqId);
      if (idx !== -1) {
        requisitions[idx].status = 'Rejected';
        requisitions[idx].supervisorNotes = reason;
        requisitions[idx].timeline.push({
          step: 'Rejected',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: 'Prof. Sneha Kulkarni (FAC-AI-019)',
          note: `Rejected with reason: ${reason}`,
        });
        saveStored(REQ_KEY, requisitions);
        appendAudit('REQUISITION_REJECTED', reqId, `Rejected request: ${reason}`, 'Faculty', 'FAC-AI-019');
        return requisitions[idx];
      }
      return null;
    });
  },

  modifyQuantity: async (reqId, itemIndex, newQty) => {
    return apiClient.simulatedFetch('MODIFY_REQUISITION_QTY', () => {
      const requisitions = getStored(REQ_KEY, INITIAL_REQUISITIONS);
      const idx = requisitions.findIndex((r) => r.id === reqId);
      if (idx !== -1 && requisitions[idx].componentsRequested[itemIndex]) {
        requisitions[idx].componentsRequested[itemIndex].quantity = Number(newQty);
        requisitions[idx].timeline.push({
          step: 'Allocation Modified',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: 'Prof. Sneha Kulkarni (FAC-AI-019)',
          note: `Adjusted quantity of ${requisitions[idx].componentsRequested[itemIndex].nomenclature} to ${newQty}`,
        });
        saveStored(REQ_KEY, requisitions);
        appendAudit('REQUISITION_QTY_MODIFIED', reqId, `Adjusted quantity to ${newQty}`, 'Faculty', 'FAC-AI-019');
        return requisitions[idx];
      }
      return null;
    });
  },

  stageForCounterPickup: async (reqId, counterNotes = 'Staged at Desk 2') => {
    return apiClient.simulatedFetch('STAGE_PICKUP', () => {
      const requisitions = getStored(REQ_KEY, INITIAL_REQUISITIONS);
      const idx = requisitions.findIndex((r) => r.id === reqId);
      if (idx !== -1) {
        requisitions[idx].status = 'Ready for Counter Pickup';
        requisitions[idx].counterNotes = counterNotes;
        requisitions[idx].timeline.push({
          step: 'Ready for Counter Pickup',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          actor: 'Ramesh Patil (Lab Assistant)',
          note: counterNotes,
        });
        saveStored(REQ_KEY, requisitions);
        appendAudit('REQUISITION_STAGED', reqId, counterNotes, 'Lab Assistant', 'STAFF-L2-004');
        return requisitions[idx];
      }
      return null;
    });
  },

  // DISPATCH TERMINAL ACTIONS
  executeDispatch: async (dispatchPayload) => {
    return apiClient.simulatedFetch('EXECUTE_DISPATCH', () => {
      // 1. Add active loan
      const loans = getStored(LOANS_KEY, INITIAL_ACTIVE_LOANS);
      const newLoan = {
        id: `LN-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        assetTag: dispatchPayload.assetTag,
        nomenclature: dispatchPayload.nomenclature,
        borrowerPrn: dispatchPayload.studentPrn,
        borrowerName: dispatchPayload.studentName,
        projectId: dispatchPayload.projectId,
        courseCode: dispatchPayload.courseCode || 'DCDS-SY-AIML',
        checkedOutDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        dueDate: dispatchPayload.dueDate || '2026-10-29 17:00:00',
        status: 'Normal',
        daysRemaining: 14,
        locationCoordinates: dispatchPayload.coordinates || 'Counter Desk 2',
        dispatchTechnician: 'Ramesh Patil (STAFF-L2-004)',
        extensionHistory: [],
      };
      saveStored(LOANS_KEY, [newLoan, ...loans]);

      // 2. Mark requisition as Dispatched if tied to one
      if (dispatchPayload.requisitionId) {
        const requisitions = getStored(REQ_KEY, INITIAL_REQUISITIONS);
        const reqIdx = requisitions.findIndex((r) => r.id === dispatchPayload.requisitionId);
        if (reqIdx !== -1) {
          requisitions[reqIdx].status = 'Dispatched';
          requisitions[reqIdx].timeline.push({
            step: 'Dispatched',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            actor: 'Ramesh Patil (Lab Assistant)',
            note: `Physical handover executed. Loan tag: ${newLoan.id}`,
          });
          saveStored(REQ_KEY, requisitions);
        }
      }

      appendAudit('DISPATCH_COMMITTED', newLoan.id, `Dispatched ${newLoan.assetTag} to PRN: ${newLoan.borrowerPrn}`, 'Lab Assistant', 'STAFF-L2-004');
      return newLoan;
    });
  },

  executeCheckinReturn: async (loanId, conditionChecklist, returnType = 'clean', defectDetails = null) => {
    return apiClient.simulatedFetch('CHECKIN_RETURN', () => {
      const loans = getStored(LOANS_KEY, INITIAL_ACTIVE_LOANS);
      const loanIdx = loans.findIndex((l) => l.id === loanId);
      const loan = loanIdx !== -1 ? loans[loanIdx] : null;

      // Remove from active loans
      if (loanIdx !== -1) {
        loans.splice(loanIdx, 1);
        saveStored(LOANS_KEY, loans);
      }

      if (returnType === 'clean') {
        appendAudit('RETURN_ACCEPTED', loanId, `Accepted clean return for ${loan ? loan.assetTag : 'Hardware'}. FIFO waitlist notified.`, 'Lab Assistant', 'STAFF-L2-004');
      } else {
        appendAudit('DEFECT_ROUTED', loanId, `Flagged defect on return: ${defectDetails || 'Condition failed'}. Sent to triage.`, 'Lab Assistant', 'STAFF-L2-004');
      }

      return { success: true, returnType, loan };
    });
  },

  // RESERVATIONS (FIFO Queue)
  getReservations: async () => {
    return apiClient.simulatedFetch('GET_RESERVATIONS', () => {
      return getStored(RES_KEY, INITIAL_RESERVATIONS);
    });
  },

  joinReservationQueue: async (item) => {
    return apiClient.simulatedFetch('JOIN_FIFO_QUEUE', () => {
      const res = getStored(RES_KEY, INITIAL_RESERVATIONS);
      const existing = res.filter((r) => r.itemId === item.id);
      const newReservation = {
        id: `RES-FIFO-${Math.floor(100 + Math.random() * 900)}`,
        itemId: item.id,
        nomenclature: item.nomenclature,
        studentPrn: '202401048',
        studentName: 'Aryan Sharma',
        projectId: 'PRJ-AIML-08',
        queuePosition: existing.length + 1,
        totalInQueue: existing.length + 1,
        estimatedAvailability: '2026-10-25',
        requestDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'Active Waitlist',
      };
      saveStored(RES_KEY, [...res, newReservation]);
      appendAudit('FIFO_QUEUE_JOINED', newReservation.id, `Joined waitlist position ${newReservation.queuePosition} for ${item.id}`, 'Student', '202401048');
      return newReservation;
    });
  },

  leaveReservationQueue: async (resId) => {
    return apiClient.simulatedFetch('LEAVE_FIFO_QUEUE', () => {
      const res = getStored(RES_KEY, INITIAL_RESERVATIONS);
      const filtered = res.filter((r) => r.id !== resId);
      saveStored(RES_KEY, filtered);
      appendAudit('FIFO_QUEUE_CANCELLED', resId, 'Withdrew from FIFO reservation waitlist', 'Student', '202401048');
      return { success: true };
    });
  },
};
