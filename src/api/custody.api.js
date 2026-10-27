import { apiClient } from './client';
import {
  INITIAL_ACTIVE_LOANS,
  INITIAL_REQUISITIONS,
  INITIAL_RESERVATIONS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

const CURRENT_SCHEMA_VERSION = 'v16_clean_retry_2026';
const LOANS_KEY = 'labtrack_loans_v16';
const REQ_KEY = 'labtrack_requisitions_v16';
const RES_KEY = 'labtrack_reservations_v16_fifo';
const AUDIT_KEY = 'labtrack_audit_v16';

function checkSchemaMigration() {
  try {
    const version = localStorage.getItem('labtrack_schema_version');
    if (version !== CURRENT_SCHEMA_VERSION) {
      localStorage.setItem('labtrack_schema_version', CURRENT_SCHEMA_VERSION);
      localStorage.removeItem('labtrack_loans_v15');
      localStorage.removeItem('labtrack_requisitions_v15');
      localStorage.removeItem('labtrack_audit_v15');
      localStorage.removeItem('labtrack_assets_v15');
      localStorage.removeItem('labtrack_requisition_basket');
      localStorage.removeItem('labtrack_loans_v14');
      localStorage.removeItem('labtrack_requisitions_v14');
      localStorage.removeItem('labtrack_reservations_v14');
      localStorage.removeItem('labtrack_audit_v14');
      localStorage.removeItem('labtrack_assets_v14');
      localStorage.removeItem('labtrack_active_dept');
    }
  } catch (e) {}
}
checkSchemaMigration();

function getStored(key, initial) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch (e) {
    return initial;
  }
}

function saveStored(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}

function appendAudit(action, targetId, details, actorRole = 'Student', actorPrn = '202401048') {
  const audits = getStored(AUDIT_KEY, INITIAL_AUDIT_LOGS);
  const newAudit = {
    id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    actorPrn,
    actorRole,
    actorName: actorRole === 'Student' ? 'Ishaan Chand' : actorRole === 'Faculty' ? 'Dr. Manoj Patil' : actorRole === 'Lab Assistant' ? 'Ramesh Patil' : 'Dr. Sumit Kumar',
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
      const reqId = `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const neededDate = new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10);

      const newReq = {
        id: reqId,
        requestNumber: reqId,
        requestDate: now,
        submittedDate: now,
        neededUntilDate: neededDate,
        studentPrn: requisitionData.studentPrn || '25070126076',
        borrowerPrn: requisitionData.studentPrn || '25070126076',
        studentName: requisitionData.studentName || 'Ishaan Chand',
        submittedBy: requisitionData.studentName || 'Ishaan Chand',
        role: 'Student',
        projectId: requisitionData.projectId || 'PROJ-000001',
        projectTitle: requisitionData.projectTitle || 'Autonomous Quadruped Vision Robot',
        department: requisitionData.department || 'Artificial Intelligence & Machine Learning',
        courseCode: requisitionData.courseCode || 'AIML-CAPSTONE-2026',
        mentorId: requisitionData.mentorId || 'T100460',
        mentorName: requisitionData.mentorName || 'Dr. Manoj Patil',
        teamReliabilityScore: 96,
        status: 'Pending Approval',
        stage: 'Faculty Mentor Review',
        technicalPurpose: requisitionData.technicalPurpose,
        purposeDescription: requisitionData.technicalPurpose,
        componentsRequested: requisitionData.componentsRequested,
        timeline: [
          {
            step: 'Request Submitted',
            stage: 'Request Submitted',
            completed: true,
            actor: `${requisitionData.studentName || 'Ishaan Chand'} (${requisitionData.studentPrn || '25070126076'})`,
            timestamp: now,
            note: 'Curriculum proposal submitted',
          },
          {
            step: 'Central Store Validation',
            stage: 'Central Store Validation',
            completed: true,
            actor: 'System Verification',
            timestamp: now,
            note: 'Hardware stock verified',
          },
          {
            step: 'Faculty Mentor Review',
            stage: 'Mentor Review',
            completed: false,
            actor: `${requisitionData.mentorName || 'Dr. Manoj Patil'} (${requisitionData.mentorId || 'T100460'})`,
            timestamp: null,
          },
          {
            step: 'HoD Review',
            stage: 'HoD Review',
            completed: false,
            actor: 'Dr. Sumit Kumar (T100101)',
            timestamp: null,
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

  approveRequisition: async (reqId, supervisorNotes = 'Approved for laboratory coursework.', actorName = 'Dr. Manoj Patil', actorPrn = 'T100460') => {
    return apiClient.simulatedFetch('APPROVE_REQUISITION', () => {
      const requisitions = getStored(REQ_KEY, INITIAL_REQUISITIONS);
      const targetKey = String(reqId || '').trim().toLowerCase();
      const idx = requisitions.findIndex(
        (r) => String(r.id || '').trim().toLowerCase() === targetKey || String(r.requestNumber || '').trim().toLowerCase() === targetKey
      );
      if (idx !== -1) {
        const req = requisitions[idx];
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const isHodActor = actorPrn?.startsWith('T1001') || actorName?.toLowerCase().includes('hod') || actorName?.toLowerCase().includes('sumit');
        const isAlreadyEndorsed = req.status === 'Faculty Endorsed' || req.status?.toLowerCase().includes('endorsed');

        if (isAlreadyEndorsed || isHodActor) {
          // HoD Department Sanction: Advances Stage 2 -> Stage 3 (Ready for Counter Pickup / Staged)
          req.status = 'Ready for Counter Pickup';
          req.stage = 'Ready for Counter Pickup';
          req.hodSanctionedBy = actorName;
          req.hodSanctionedNotes = supervisorNotes;

          let hodStepFound = false;
          if (Array.isArray(req.timeline)) {
            req.timeline = req.timeline.map((step) => {
              if (step.step?.toLowerCase().includes('mentor') || step.stage?.toLowerCase().includes('mentor') || step.step?.toLowerCase().includes('faculty')) {
                return {
                  ...step,
                  completed: true,
                  actor: step.actor && !step.actor.includes('N/A') ? step.actor : `${req.mentorName || 'Dr. Manoj Patil'} (${req.mentorId || 'T100460'})`,
                  timestamp: step.timestamp || now,
                  note: step.note || 'Approved for departmental coursework milestones.',
                };
              }
              if (step.step?.toLowerCase().includes('hod') || step.stage?.toLowerCase().includes('hod')) {
                hodStepFound = true;
                return {
                  ...step,
                  completed: true,
                  actor: `${actorName} (${actorPrn})`,
                  timestamp: now,
                  note: supervisorNotes,
                };
              }
              return step;
            });
          }

          if (!hodStepFound) {
            req.timeline.push({
              step: 'HoD Review',
              stage: 'HoD Review',
              completed: true,
              timestamp: now,
              actor: `${actorName} (${actorPrn})`,
              note: supervisorNotes,
            });
          }

          saveStored(REQ_KEY, requisitions);
          appendAudit('HOD_SANCTION_GRANTED', reqId, `Department allocation sanctioned by HoD: ${supervisorNotes}`, 'HoD / Admin', actorPrn);
          return req;
        } else {
          // Faculty Guide Endorsement: Advances Stage 1 -> Stage 2 (Faculty Endorsed)
          req.status = 'Faculty Endorsed';
          req.stage = 'Faculty Endorsed • Staging';
          req.supervisorNotes = supervisorNotes;
          req.approvedBy = actorName;

          let mentorStepFound = false;
          if (Array.isArray(req.timeline)) {
            req.timeline = req.timeline.map((step) => {
              if (step.step?.toLowerCase().includes('faculty') || step.stage?.toLowerCase().includes('mentor') || step.step?.toLowerCase().includes('mentor')) {
                mentorStepFound = true;
                return {
                  ...step,
                  completed: true,
                  actor: `${actorName} (${actorPrn})`,
                  timestamp: now,
                  note: supervisorNotes,
                };
              }
              return step;
            });
          }

          if (!mentorStepFound) {
            req.timeline.push({
              step: 'Faculty Mentor Review',
              stage: 'Mentor Review',
              completed: true,
              timestamp: now,
              actor: `${actorName} (${actorPrn})`,
              note: supervisorNotes,
            });
          }

          saveStored(REQ_KEY, requisitions);
          appendAudit('REQUISITION_APPROVED', reqId, `Faculty endorsement: ${supervisorNotes}`, 'Faculty', actorPrn);
          return req;
        }
      }
      return null;
    });
  },

  deleteRequisition: async (reqId, actorName = 'Ishaan Chand', actorPrn = '25070126076') => {
    return apiClient.simulatedFetch('DELETE_REQUISITION', () => {
      const requisitions = getStored(REQ_KEY, INITIAL_REQUISITIONS);
      const targetKey = String(reqId || '').trim().toLowerCase();
      const filtered = requisitions.filter(
        (r) => String(r.id || '').trim().toLowerCase() !== targetKey && String(r.requestNumber || '').trim().toLowerCase() !== targetKey
      );
      saveStored(REQ_KEY, filtered);
      appendAudit('REQUISITION_CANCELLED', reqId, `Requisition cancelled before approval by ${actorName}`, 'Student', actorPrn);
      return { success: true, id: reqId };
    });
  },

  rejectRequisition: async (reqId, reason, actorName = 'Dr. Manoj Patil', actorPrn = 'T100460') => {
    return apiClient.simulatedFetch('REJECT_REQUISITION', () => {
      const requisitions = getStored(REQ_KEY, INITIAL_REQUISITIONS);
      const targetKey = String(reqId || '').trim().toLowerCase();
      const idx = requisitions.findIndex(
        (r) => String(r.id || '').trim().toLowerCase() === targetKey || String(r.requestNumber || '').trim().toLowerCase() === targetKey
      );
      if (idx !== -1) {
        requisitions[idx].status = 'Rejected';
        requisitions[idx].supervisorNotes = reason;
        requisitions[idx].timeline.push({
          step: 'Rejected',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
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
      const targetKey = String(reqId || '').trim().toLowerCase();
      const idx = requisitions.findIndex(
        (r) => String(r.id || '').trim().toLowerCase() === targetKey || String(r.requestNumber || '').trim().toLowerCase() === targetKey
      );
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
      const targetKey = String(reqId || '').trim().toLowerCase();
      const idx = requisitions.findIndex(
        (r) => String(r.id || '').trim().toLowerCase() === targetKey || String(r.requestNumber || '').trim().toLowerCase() === targetKey
      );
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
        requisitionId: dispatchPayload.requisitionId || null,
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
        const reqTarget = String(dispatchPayload.requisitionId || '').trim().toLowerCase();
        const reqIdx = requisitions.findIndex(
          (r) => String(r.id || '').trim().toLowerCase() === reqTarget || String(r.requestNumber || '').trim().toLowerCase() === reqTarget
        );
        if (reqIdx !== -1) {
          const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
          requisitions[reqIdx].status = 'Dispatched';
          requisitions[reqIdx].stage = 'Dispatched & In Custody';
          if (!requisitions[reqIdx].timeline) requisitions[reqIdx].timeline = [];
          requisitions[reqIdx].timeline.push({
            step: 'Dispatched & In Custody',
            stage: 'Dispatched',
            completed: true,
            timestamp: now,
            actor: 'Ramesh Patil (Lab Assistant)',
            note: `Physical hardware kit handover committed at counter desk. Asset tag: ${newLoan.assetTag} (Loan ID: ${newLoan.id})`,
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

      // Update tied requisition if found
      if (loan) {
        const requisitions = getStored(REQ_KEY, INITIAL_REQUISITIONS);
        const reqIdx = requisitions.findIndex(
          (r) =>
            (loan.requisitionId && (r.id === loan.requisitionId || r.requestNumber === loan.requisitionId)) ||
            ((r.studentPrn === loan.borrowerPrn || r.borrowerPrn === loan.borrowerPrn) &&
             (r.status === 'Dispatched' || r.stage?.includes('Dispatched') || r.status?.toLowerCase().includes('dispatch')))
        );
        if (reqIdx !== -1) {
          const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
          requisitions[reqIdx].status = 'Returned';
          requisitions[reqIdx].stage = 'Returned & Restocked';
          if (!requisitions[reqIdx].timeline) requisitions[reqIdx].timeline = [];
          const hasReturn = requisitions[reqIdx].timeline.some((s) => (s.step || '').toLowerCase().includes('return'));
          if (!hasReturn) {
            requisitions[reqIdx].timeline.push({
              step: 'Returned & Restocked',
              stage: 'Returned',
              completed: true,
              timestamp: now,
              actor: 'Ramesh Patil (Lab Assistant)',
              note: `Hardware (${loan.assetTag}) checked back into depot. Inventory balance restocked (+1). Condition: ${returnType === 'clean' ? 'Clean & Operational' : 'Flagged Defective'}.`,
            });
          }
          saveStored(REQ_KEY, requisitions);
        }
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
      const activePrn = localStorage.getItem('labtrack_active_prn') || '25070126076';
      const activeRole = localStorage.getItem('labtrack_active_role') || 'Student';
      const studentName = activePrn === '25070126076' ? 'Ishaan Chand' : 'Student Requisitioner';
      const newReservation = {
        id: `RES-FIFO-${Math.floor(100 + Math.random() * 900)}`,
        itemId: item.id || item.assetTag,
        nomenclature: item.nomenclature,
        studentPrn: activePrn,
        borrowerPrn: activePrn,
        requestorPrn: activePrn,
        studentName: studentName,
        projectId: 'PROJ-000001',
        queuePosition: existing.length + 1,
        totalInQueue: existing.length + 1,
        estimatedAvailability: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        requestDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        status: 'Active Waitlist',
        department: item.department || 'AIML',
        notes: `Position #${existing.length + 1} in FIFO backlog`,
      };
      saveStored(RES_KEY, [...res, newReservation]);
      appendAudit('FIFO_QUEUE_JOINED', newReservation.id, `Joined waitlist position ${newReservation.queuePosition} for ${item.id}`, activeRole, activePrn);
      return newReservation;
    });
  },

  leaveReservationQueue: async (resId) => {
    return apiClient.simulatedFetch('LEAVE_FIFO_QUEUE', () => {
      const res = getStored(RES_KEY, INITIAL_RESERVATIONS);
      const filtered = res.filter((r) => r.id !== resId);
      const activePrn = localStorage.getItem('labtrack_active_prn') || '25070126076';
      const activeRole = localStorage.getItem('labtrack_active_role') || 'Student';
      saveStored(RES_KEY, filtered);
      appendAudit('FIFO_QUEUE_CANCELLED', resId, 'Withdrew from FIFO reservation waitlist', activeRole, activePrn);
      return { success: true };
    });
  },
};
