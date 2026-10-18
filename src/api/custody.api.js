import { apiClient } from './client';
import {
  INITIAL_ACTIVE_LOANS,
  INITIAL_REQUISITIONS,
  INITIAL_RESERVATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

const LOANS_KEY = 'labtrack_loans_db';
const REQ_KEY = 'labtrack_requisitions_db';
const RES_KEY = 'labtrack_reservations_db';
const AUDIT_KEY = 'labtrack_audit_db';

function getStored(key, initial) {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initial));
    return initial;
  }
  try {
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
    actorName: actorRole === 'Student' ? 'Aryan Sharma' : actorRole === 'Faculty' ? 'Prof. Sneha Kulkarni' : actorRole === 'Lab Assistant' ? 'Ramesh Patil' : 'Dr. K. V. Ramanathan',
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
      const stored = getStored(REQ_KEY, INITIAL_REQUISITIONS);
      let modified = false;
      const sanitized = stored.map((r) => {
        if (r.mentorName && r.mentorName.includes('Sneha Kulkarni') && r.mentorId !== 'FAC-CCE-004') {
          modified = true;
          return { ...r, mentorId: 'FAC-CCE-004' };
        }
        if (r.projectId === 'PRJ-AIML-08' && r.mentorName && r.mentorName.includes('Sneha Kulkarni')) {
          modified = true;
          return { ...r, mentorName: 'Dr. Anjali Dalvi', mentorId: 'FAC-AI-019' };
        }
        return r;
      });
      if (modified) {
        saveStored(REQ_KEY, sanitized);
      }
      return sanitized;
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
        mentorName: requisitionData.mentorName || 'Dr. Anjali Dalvi',
        teamReliabilityScore:
          requisitionData.studentPrn?.startsWith('FAC-') ||
          requisitionData.studentPrn?.startsWith('HOD-') ||
          requisitionData.isFacultyProject
            ? null
            : 94,
        isFacultyProject:
          Boolean(
            requisitionData.studentPrn?.startsWith('FAC-') ||
            requisitionData.studentPrn?.startsWith('HOD-') ||
            requisitionData.isFacultyProject
          ),
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

  approveRequisition: async (reqId, supervisorNotes = 'Approved for laboratory coursework.', actorName = 'Dr. Anjali Dalvi', actorPrn = 'FAC-AI-019') => {
    return apiClient.simulatedFetch('APPROVE_REQUISITION', () => {
      const requisitions = getStored(REQ_KEY, INITIAL_REQUISITIONS);
      const idx = requisitions.findIndex((r) => r.id === reqId);
      if (idx !== -1) {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
        requisitions[idx].status = 'Faculty Endorsed';
        requisitions[idx].supervisorNotes = supervisorNotes;
        requisitions[idx].approvedBy = actorName;
        requisitions[idx].approvedAt = now;
        requisitions[idx].timeline.push({
          step: 'Faculty Endorsed',
          timestamp: now,
          actor: `${actorName} (${actorPrn})`,
          note: supervisorNotes,
        });
        saveStored(REQ_KEY, requisitions);
        appendAudit('REQUISITION_APPROVED', reqId, `Faculty endorsement: ${supervisorNotes}`, 'Faculty', actorPrn);
        return requisitions[idx];
      }
      return null;
    });
  },

  rejectRequisition: async (reqId, reason, actorName = 'Dr. Anjali Dalvi', actorPrn = 'FAC-AI-019') => {
    return apiClient.simulatedFetch('REJECT_REQUISITION', () => {
      const requisitions = getStored(REQ_KEY, INITIAL_REQUISITIONS);
      const idx = requisitions.findIndex((r) => r.id === reqId);
      if (idx !== -1) {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
        requisitions[idx].status = 'Rejected';
        requisitions[idx].supervisorNotes = reason;
        requisitions[idx].rejectedBy = actorName;
        requisitions[idx].rejectedAt = now;
        requisitions[idx].timeline.push({
          step: 'Rejected',
          timestamp: now,
          actor: `${actorName} (${actorPrn})`,
          note: `Rejected with reason: ${reason}`,
        });
        saveStored(REQ_KEY, requisitions);
        appendAudit('REQUISITION_REJECTED', reqId, `Rejected request: ${reason}`, 'Faculty', actorPrn);
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

      if (returnType === 'clean' && loan) {
        // Advance FIFO waitlist for this hardware asset if queued
        const reservations = getStored(RES_KEY, INITIAL_RESERVATIONS);
        const waitingForThis = reservations.filter(
          (r) => (r.itemId === loan.assetTag || r.nomenclature === loan.nomenclature) && r.status === 'Active Waitlist'
        );
        if (waitingForThis.length > 0) {
          waitingForThis[0].status = 'Ready for Requisition';
          saveStored(RES_KEY, reservations);
        }
        appendAudit('RETURN_ACCEPTED', loanId, `Accepted clean return & reset for ${loan.assetTag}. Restocked to available inventory.`, 'Lab Assistant', 'STAFF-L2-004');
      } else {
        appendAudit('DEFECT_ROUTED', loanId, `Flagged defect on return for ${loan ? loan.assetTag : 'Hardware'}. Routed to Defect Bench.`, 'Lab Assistant', 'STAFF-L2-004');
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
