import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { inventoryApi } from '../api/inventory.api';
import { custodyApi } from '../api/custody.api';
import { accountabilityApi } from '../api/accountability.api';
import { INITIAL_ASSETS } from '../data/mockData';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

export const DEPARTMENTS = [
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
  if (!labId) return 'AIML';
  const upper = String(labId).toUpperCase();
  if (upper.endsWith('AIML') || upper.includes('AIML')) return 'AIML';
  if (upper.endsWith('CSE') || upper.includes('CSE')) return 'CSE';
  if (upper.endsWith('RA') || upper.includes('RA')) return 'RA';
  return 'AIML';
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
  const targetDept = (deptCode && deptCode !== 'ALL') ? deptCode : 'AIML';
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

  if (breakdown.length > 0) {
    const deptLabs = breakdown.filter((b) => {
      const dept = b.branch || getDeptFromLabId(b.lab_id);
      return dept === targetDept;
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
  const match = primaryDept === targetDept;
  return {
    available: match ? (item.availableStock ?? 0) : 0,
    total: match ? (item.totalStock ?? 0) : 0,
    depts: match ? [targetDept] : deptsList,
    isHousedInDept: match && (item.availableStock ?? 0) > 0,
  };
};

export const resolveItemLocationForDept = (item, deptCode) => {
  if (!item) return { coordinates: 'SIT-LAB', labRoom: 'Department Laboratory' };
  const targetDept = (deptCode && deptCode !== 'ALL') ? deptCode : 'AIML';
  const breakdown = item.labBreakdown || item.labs || [];
  if (breakdown.length > 0) {
    const deptLabs = breakdown.filter((b) => {
      const d = b.branch || getDeptFromLabId(b.lab_id);
      return d === targetDept;
    });
    if (deptLabs.length > 0) {
      return {
        coordinates: deptLabs[0].lab_id,
        labRoom: deptLabs[0].lab_name,
        good: deptLabs[0].good ?? 0,
        bad: deptLabs[0].bad ?? 0,
      };
    }
  }
  return {
    coordinates: item.coordinates || item.primaryLabId || 'SIT-LAB',
    labRoom: item.labRoom || 'Department Laboratory',
    good: item.availableStock ?? 0,
    bad: item.badStock ?? 0,
  };
};

const LabDataContext = createContext(null);

export function LabDataProvider({ children }) {
  const { addToast } = useNotification();
  const { currentUser } = useAuth();

  const userDepartment = getUserDepartment(currentUser);
  const isStudent = currentUser?.role === 'Student';
  const CURRENT_SCHEMA_VERSION = 'v16_clean_retry_2026';

  const [selectedDepartment, setSelectedDepartment] = useState(() => {
    try {
      const version = localStorage.getItem('labtrack_schema_version');
      if (version !== CURRENT_SCHEMA_VERSION) {
        localStorage.setItem('labtrack_schema_version', CURRENT_SCHEMA_VERSION);
        localStorage.removeItem('labtrack_active_dept');
        localStorage.removeItem('labtrack_active_facility');
        localStorage.removeItem('labtrack_requisition_basket');
        // Clear all previous schema keys for clean slate
        localStorage.removeItem('labtrack_requisitions_v15');
        localStorage.removeItem('labtrack_loans_v15');
        localStorage.removeItem('labtrack_assets_v15');
        localStorage.removeItem('labtrack_audit_v15');
        localStorage.removeItem('labtrack_requisitions_v14');
        localStorage.removeItem('labtrack_loans_v14');
        localStorage.removeItem('labtrack_reservations_v14');
        localStorage.removeItem('labtrack_read_notifications_v14');
        localStorage.removeItem('labtrack_audit_v14');
        localStorage.removeItem('labtrack_assets_v14');
        return isStudent ? userDepartment : (userDepartment || 'AIML');
      }
      const stored = localStorage.getItem('labtrack_active_dept');
      if (stored && ['AIML', 'CSE', 'RA'].includes(stored)) {
        return isStudent ? userDepartment : stored;
      }
      return isStudent ? userDepartment : (userDepartment || 'AIML');
    } catch {
      return isStudent ? userDepartment : (userDepartment || 'AIML');
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
    const valid = ['AIML', 'CSE', 'RA'].includes(deptCode) ? deptCode : 'AIML';
    setSelectedDepartment(valid);
    try {
      localStorage.setItem('labtrack_active_dept', valid);
      localStorage.setItem('labtrack_active_facility', `${valid} DEPT`);
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

  // Authoritative Physical Asset Registry (36 SIT Barcodes)
  const [assets, setAssets] = useState(() => {
    try {
      const version = localStorage.getItem('labtrack_schema_version');
      if (version !== CURRENT_SCHEMA_VERSION) {
        localStorage.setItem('labtrack_schema_version', CURRENT_SCHEMA_VERSION);
        localStorage.setItem('labtrack_assets_v16', JSON.stringify(INITIAL_ASSETS));
        return INITIAL_ASSETS;
      }
      const saved = localStorage.getItem('labtrack_assets_v16');
      return saved ? JSON.parse(saved) : INITIAL_ASSETS;
    } catch {
      return INITIAL_ASSETS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('labtrack_assets_v16', JSON.stringify(assets));
    } catch (e) {
      console.error('Failed to persist assets to localStorage:', e);
    }
  }, [assets]);

  // Barcode resolution helper: maps 36 physical SIT barcodes, default IDs, serial numbers to items & loans
  const resolveBarcode = useCallback((barcodeOrQuery) => {
    if (!barcodeOrQuery) return null;
    const q = String(barcodeOrQuery).trim().toLowerCase();

    // 1. Physical assets match (SIT-AIML-5CL07-0043, JN-043, NV-JN-88303, etc.)
    const matchedAsset = assets.find((a) =>
      a.barcode?.toLowerCase() === q ||
      a.assetTag?.toLowerCase() === q ||
      a.defaultId?.toLowerCase() === q ||
      a.serialNumber?.toLowerCase() === q
    );

    if (matchedAsset) {
      const parentItem = inventory.find((i) => i.id === matchedAsset.itemId) || {};
      const activeLoan = activeLoans.find((l) => l.assetTag === matchedAsset.barcode || l.assetTag === matchedAsset.assetTag);
      return {
        ...matchedAsset,
        parentItem,
        activeLoan: activeLoan || null,
        isHoused: true,
      };
    }

    // 2. Fallback catalog item match
    const matchedItem = inventory.find((i) =>
      i.id?.toLowerCase() === q ||
      i.assetTag?.toLowerCase() === q ||
      i.sku?.toLowerCase() === q
    );
    if (matchedItem) {
      return {
        barcode: matchedItem.assetTag || matchedItem.id,
        assetTag: matchedItem.assetTag || matchedItem.id,
        itemId: matchedItem.id,
        nomenclature: matchedItem.nomenclature,
        parentItem: matchedItem,
        state: matchedItem.availableStock > 0 ? 'AVAILABLE' : 'OUT_OF_STOCK',
        department: getDeptFromLabId(matchedItem.primaryLabId || matchedItem.labRoom),
        costTier: matchedItem.costTier,
        category: matchedItem.category,
        image: matchedItem.image,
      };
    }

    return null;
  }, [assets, inventory, activeLoans]);

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

  const notifyCrossTabSync = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('labtrack_lifecycle_sync');
        bc.postMessage({ type: 'SYNC', timestamp: Date.now() });
        bc.close();
      }
    } catch (e) {}
  }, []);

  // Load all initial data and reconcile with real-time backend lifecycle events
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

      let reconciledRequisitions = reqsRes.data || [];
      try {
        const eventsRes = await fetch('/api/notifications/requisition-events');
        if (eventsRes.ok) {
          const { events } = await eventsRes.json();
          if (Array.isArray(events) && events.length > 0) {
            const eventsByReq = new Map();
            for (const ev of events) {
              const reqKey = String(ev.request_id || '').trim().toLowerCase();
              if (reqKey && !eventsByReq.has(reqKey)) {
                eventsByReq.set(reqKey, ev);
              }
            }

            let modified = false;

            // 1. Ingest any newly submitted requisitions recorded by the backend that are not yet in local state
            const existingIds = new Set(
              reconciledRequisitions.map((r) => String(r.id || r.requestNumber || '').trim().toLowerCase())
            );

            const reversedEvents = [...events].reverse();
            for (const ev of reversedEvents) {
              const reqKey = String(ev.request_id || '').trim().toLowerCase();
              if (reqKey && !existingIds.has(reqKey) && ev.event === 'REQUEST_SUBMITTED') {
                const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
                const neededDate = new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10);
                const newReqFromEvent = {
                  id: ev.request_id,
                  requestNumber: ev.request_id,
                  requestDate: now,
                  submittedDate: now,
                  neededUntilDate: neededDate,
                  studentPrn: ev.student_prn || '25070126076',
                  borrowerPrn: ev.student_prn || '25070126076',
                  studentName: ev.student_name || 'Ishaan Chand',
                  submittedBy: ev.student_name || 'Ishaan Chand',
                  role: 'Student',
                  projectId: 'PROJ-000001',
                  projectTitle: ev.project_name || 'Autonomous Quadruped Vision Robot',
                  department: 'Artificial Intelligence & Machine Learning',
                  courseCode: 'AIML-CAPSTONE-2026',
                  mentorId: 'T100460',
                  mentorName: ev.mentor_name || 'Dr. Manoj Patil',
                  teamReliabilityScore: 96,
                  status: 'Pending Approval',
                  stage: 'Faculty Mentor Review',
                  technicalPurpose: ev.technical_purpose || 'Curriculum Project',
                  purposeDescription: ev.technical_purpose || 'Curriculum Project',
                  componentsRequested: Array.isArray(ev.components) ? ev.components : [],
                  timeline: [
                    {
                      step: 'Request Submitted',
                      stage: 'Request Submitted',
                      completed: true,
                      actor: `${ev.student_name || 'Ishaan Chand'} (${ev.student_prn || '25070126076'})`,
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
                      actor: `${ev.mentor_name || 'Dr. Manoj Patil'} (T100460)`,
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
                reconciledRequisitions.unshift(newReqFromEvent);
                existingIds.add(reqKey);
                modified = true;
              }
            }

            // 2. Reconcile statuses (approvals, rejections)
            reconciledRequisitions = reconciledRequisitions.map((r) => {
              const idKey = String(r.id || '').trim().toLowerCase();
              const numKey = String(r.requestNumber || '').trim().toLowerCase();
              const ev = eventsByReq.get(idKey) || eventsByReq.get(numKey);
              if (!ev) return r;

              if (ev.event === 'REQUISITION_RETURNED') {
                if (r.status !== 'Returned') {
                  modified = true;
                  const now = ev.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19);
                  return {
                    ...r,
                    status: 'Returned',
                    stage: 'Returned & Restocked',
                    timeline: [
                      ...(r.timeline || []).filter((s) => !(s.step || '').toLowerCase().includes('return')),
                      {
                        step: 'Returned & Restocked',
                        stage: 'Returned',
                        completed: true,
                        timestamp: now,
                        actor: 'Ramesh Patil (Lab Assistant)',
                        note: ev.technical_purpose || 'Hardware returned & restocked to depot inventory pool.',
                      },
                    ],
                  };
                }
              } else if (ev.event === 'REQUISITION_DISPATCHED') {
                if (r.status !== 'Dispatched' && r.status !== 'Returned') {
                  modified = true;
                  const now = ev.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19);
                  return {
                    ...r,
                    status: 'Dispatched',
                    stage: 'Dispatched & In Custody',
                    dispatchedBy: ev.mentor_name || 'Ramesh Patil (Lab Assistant)',
                    timeline: [
                      ...(r.timeline || []).filter((s) => s.step !== 'Dispatched & In Custody'),
                      {
                        step: 'Dispatched & In Custody',
                        stage: 'Dispatched',
                        completed: true,
                        timestamp: now,
                        actor: ev.mentor_name || 'Ramesh Patil (Lab Assistant)',
                        note: ev.technical_purpose || 'Physical hardware kit handover committed at counter desk.',
                      },
                    ],
                  };
                }
              } else if (ev.event === 'REQUISITION_REJECTED') {
                const note = (ev.technical_purpose || '').replace(/^Rejection reason:\s*/i, '') || 'Requisition declined during review.';
                if (r.status !== 'Rejected' || r.supervisorNotes !== note) {
                  modified = true;
                  return {
                    ...r,
                    status: 'Rejected',
                    supervisorNotes: note,
                    timeline: Array.isArray(r.timeline) && r.timeline.some((t) => t.step === 'Rejected')
                      ? r.timeline
                      : [
                          ...(r.timeline || []),
                          {
                            step: 'Rejected',
                            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                            actor: `${ev.mentor_name || 'Dr. Manoj Patil'}`,
                            note: `Rejected with reason: ${note}`,
                          },
                        ],
                  };
                }
              } else if (ev.event === 'HOD_APPROVED' || ev.event === 'HOD_SANCTIONED') {
                if (r.status !== 'Ready for Counter Pickup' && r.status !== 'Dispatched' && r.status !== 'Returned') {
                  modified = true;
                  const now = ev.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19);
                  return {
                    ...r,
                    status: 'Ready for Counter Pickup',
                    stage: 'Ready for Counter Pickup',
                    hodSanctionedBy: ev.mentor_name || 'Dr. Sumit Kumar (HoD)',
                    hodSanctionedNotes: ev.technical_purpose || 'Department allocation sanctioned by HoD.',
                    timeline: (r.timeline || []).map((step) => {
                      if (step.step?.toLowerCase().includes('faculty') || step.stage?.toLowerCase().includes('mentor') || step.step?.toLowerCase().includes('mentor')) {
                        return {
                          ...step,
                          completed: true,
                          actor: step.actor && !step.actor.includes('N/A') ? step.actor : `${r.mentorName || 'Dr. Manoj Patil'} (${r.mentorId || 'T100460'})`,
                          timestamp: step.timestamp || now,
                          note: step.note || 'Approved for departmental coursework milestones.',
                        };
                      }
                      if (step.step?.toLowerCase().includes('hod') || step.stage?.toLowerCase().includes('hod')) {
                        return {
                          ...step,
                          completed: true,
                          actor: `${ev.mentor_name || 'Dr. Sumit Kumar'} (T100101)`,
                          timestamp: now,
                          note: ev.technical_purpose || 'Department allocation sanctioned by HoD.',
                        };
                      }
                      return step;
                    }),
                  };
                }
              } else if (ev.event === 'MENTOR_APPROVED') {
                if (r.status !== 'Faculty Endorsed' && r.status !== 'Ready for Counter Pickup' && r.status !== 'Dispatched' && r.status !== 'Returned') {
                  modified = true;
                  const now = ev.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19);
                  return {
                    ...r,
                    status: 'Faculty Endorsed',
                    stage: 'Faculty Endorsed • Staging',
                    supervisorNotes: ev.technical_purpose || 'Academic scope and technical feasibility verified.',
                    timeline: (r.timeline || []).map((step) => {
                      if (step.step?.toLowerCase().includes('faculty') || step.stage?.toLowerCase().includes('mentor') || step.step?.toLowerCase().includes('mentor')) {
                        return {
                          ...step,
                          completed: true,
                          actor: `${ev.mentor_name || 'Dr. Manoj Patil'} (T100460)`,
                          timestamp: now,
                          note: ev.technical_purpose || 'Approved for departmental coursework milestones.',
                        };
                      }
                      return step;
                    }),
                  };
                }
              }
              return r;
            });

            if (modified) {
              try {
                localStorage.setItem('labtrack_requisitions_v15', JSON.stringify(reconciledRequisitions));
              } catch (e) {}
            }
          }
        }
      } catch (err) {
        console.warn('Backend requisition event reconciliation skipped:', err);
      }

      setInventory(invRes.data);
      try {
        const rawAssets = localStorage.getItem('labtrack_assets_v15');
        if (rawAssets) {
          const parsed = JSON.parse(rawAssets);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAssets(parsed);
          }
        }
      } catch (e) {}
      setActiveLoans(loansRes.data);
      setRequisitions(reconciledRequisitions);
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

    let bc = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('labtrack_lifecycle_sync');
        bc.onmessage = () => {
          loadData();
        };
      }
    } catch (e) {}

    const handleStorageChange = (e) => {
      if (!e.key || e.key.includes('requisition') || e.key.includes('loans') || e.key.includes('inventory') || e.key.includes('assets')) {
        loadData();
      }
    };
    const handleCustomUpdate = () => {
      loadData();
    };
    const handleFocus = () => {
      loadData();
    };

    // Live sync polling interval to guarantee tabs are immediately up to date
    const syncInterval = setInterval(() => {
      loadData();
    }, 2500);

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('labtrack-requisition-updated', handleCustomUpdate);
    window.addEventListener('focus', handleFocus);

    return () => {
      if (bc) {
        try { bc.close(); } catch (e) {}
      }
      clearInterval(syncInterval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('labtrack-requisition-updated', handleCustomUpdate);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadData]);

  // Basket methods with Departmental Issue Governance & Stock Limit Checking
  const addToBasket = (item, quantity = 1) => {
    const stockInfo = isStudent ? getItemDeptStock(item, userDepartment) : { available: item.availableStock ?? 99 };
    if (isStudent && stockInfo.available <= 0) {
      addToast({
        title: 'Cross-Department Issue Prohibited',
        message: `${item.nomenclature} is not housed in ${userDepartment} department labs. SIT policy strictly restricts student requisitions to their enrolled department labs.`,
        type: 'warning',
      });
      return false;
    }

    const currentInBasket = basket.find((i) => i.id === item.id)?.quantity || 0;
    const maxAvailable = stockInfo.available;
    if (currentInBasket + quantity > maxAvailable) {
      addToast({
        title: 'Stock Limit Reached',
        message: `Only ${maxAvailable} unit(s) of ${item.nomenclature} are available in depot. Cannot stage more than in-stock count.`,
        type: 'warning',
      });
      return false;
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
    const itemInBasket = basket.find((i) => i.id === itemId);
    if (itemInBasket) {
      const stockInfo = isStudent ? getItemDeptStock(itemInBasket, userDepartment) : { available: itemInBasket.availableStock ?? 99 };
      if (quantity > stockInfo.available) {
        addToast({
          title: 'Stock Limit Reached',
          message: `Cannot request ${quantity} units: Only ${stockInfo.available} currently available in depot.`,
          type: 'warning',
        });
        return;
      }
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

    // Strict stock availability validation before submission
    for (const item of basket) {
      const stockInfo = isStudent ? getItemDeptStock(item, userDepartment) : { available: item.availableStock ?? 0 };
      if ((item.quantity || 1) > stockInfo.available) {
        addToast({
          title: 'Stock Shortage',
          message: `Cannot submit requisition: ${item.nomenclature} requested quantity (${item.quantity}) exceeds available depot stock (${stockInfo.available}).`,
          type: 'error',
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
      studentPrn: currentUser?.prn || '25070126076',
      studentName: currentUser?.name || 'Ishaan Chand',
      projectId: selectedProject?.id || currentUser?.projectId || 'PROJ-000001',
      projectTitle: selectedProject?.title || 'Autonomous Quadruped Vision Robot',
      department: selectedProject?.department || userDepartment || 'AIML',
      courseCode: selectedProject?.courseCode || currentUser?.courseCode || 'AIML-CAPSTONE-2026',
      mentorId: selectedProject?.mentorId || currentUser?.mentorId || 'T100460',
      mentorName: selectedProject?.mentorName || currentUser?.mentorName || 'Dr. Manoj Patil',
      technicalPurpose,
      componentsRequested,
    });

    if (res.ok) {
      // Synchronously update local state so views update instantly
      setRequisitions((prev) => [res.data, ...prev.filter((r) => r.id !== res.data.id)]);

      try {
        window.dispatchEvent(new CustomEvent('labtrack-requisition-updated', { detail: res.data }));
      } catch (e) {}

      // Dispatch real live lifecycle email via backend SMTP
      try {
        await fetch('/api/notifications/requisition-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'REQUEST_SUBMITTED',
            request_id: res.data.id,
            student_name: currentUser?.name || 'Ishaan Chand',
            student_prn: currentUser?.prn || '25070126076',
            project_name: selectedProject?.title || selectedProject?.name || 'Autonomous Quadruped Vision Robot',
            mentor_name: selectedProject?.mentorName || 'Dr. Manoj Patil',
            technical_purpose: technicalPurpose,
            components: componentsRequested,
          }),
        });
      } catch (err) {
        console.warn('Backend notification dispatch warning:', err);
      }

      clearBasket();
      setIsBasketOpen(false);
      await loadData();
      notifyCrossTabSync();
      addToast({
        title: 'Requisition Submitted & Email Dispatched',
        message: `Order #${res.data.id} registered. Notification email dispatched to mentor inbox (labtrack821@gmail.com).`,
        type: 'success',
      });
      return true;
    }
    return false;
  };

  // Approval methods
  const approveRequisition = async (reqId, notes) => {
    const targetKey = String(reqId || '').trim().toLowerCase();
    const targetReq = requisitions.find(
      (r) => String(r.id || '').trim().toLowerCase() === targetKey || String(r.requestNumber || '').trim().toLowerCase() === targetKey
    );
    const isHodActor =
      currentUser?.role === 'HoD / Admin' ||
      currentUser?.prn?.startsWith('T1001') ||
      currentUser?.designation?.toLowerCase().includes('head') ||
      currentUser?.designation?.toLowerCase().includes('hod') ||
      currentUser?.name?.toLowerCase().includes('sumit');
    const isAlreadyEndorsed = targetReq?.status === 'Faculty Endorsed' || targetReq?.status?.toLowerCase().includes('endorsed');
    const isHodAction = isHodActor || isAlreadyEndorsed;

    const approverName = currentUser?.name || (isHodAction ? 'Dr. Sumit Kumar (HoD)' : 'Dr. Manoj Patil');
    const approverPrn = currentUser?.prn || (isHodAction ? 'T100101' : 'T100460');

    const res = await custodyApi.approveRequisition(reqId, notes, approverName, approverPrn);
    if (res.ok) {
      const updatedStatus = isHodAction ? 'Ready for Counter Pickup' : 'Faculty Endorsed';
      setRequisitions((prev) =>
        prev.map((r) => {
          const rKey = String(r.id || '').trim().toLowerCase();
          const rNum = String(r.requestNumber || '').trim().toLowerCase();
          return (rKey === targetKey || rNum === targetKey)
            ? {
                ...r,
                ...(res.data || {}),
                status: updatedStatus,
                stage: updatedStatus,
                supervisorNotes: notes,
                approvedBy: approverName,
                ...(isHodAction ? { hodSanctionedBy: approverName, hodSanctionedNotes: notes } : {}),
                timeline: res.data?.timeline || r.timeline,
              }
            : r;
        })
      );

      try {
        window.dispatchEvent(new CustomEvent('labtrack-requisition-updated', {
          detail: { id: reqId, status: updatedStatus }
        }));
      } catch (e) {}

      try {
        await fetch('/api/notifications/requisition-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: isHodAction ? 'HOD_APPROVED' : 'MENTOR_APPROVED',
            request_id: reqId,
            student_name: targetReq?.studentName || 'Ishaan Chand',
            student_prn: targetReq?.studentPrn || '25070126076',
            project_name: targetReq?.projectTitle || 'Autonomous Quadruped Vision Robot',
            mentor_name: approverName,
            technical_purpose: notes || (isHodAction ? 'Departmental allocation sanctioned by HoD.' : 'Academic scope and technical feasibility verified.'),
            components: targetReq?.componentsRequested || [],
          }),
        });
      } catch (err) {
        console.warn('Backend approval dispatch warning:', err);
      }

      await loadData();
      notifyCrossTabSync();

      if (isHodAction) {
        addToast({
          title: 'Department Sanction Granted by HoD',
          message: `Requisition ${reqId} sanctioned by ${approverName}. Advanced to Counter Desk for staging & physical handover.`,
          type: 'success',
        });
      } else {
        addToast({
          title: 'Requisition Endorsed & Email Dispatched',
          message: `Requisition ${reqId} approved. Official notification email sent to lab in-charge (labtrack821@gmail.com).`,
          type: 'success',
        });
      }
    }
  };

  const rejectRequisition = async (reqId, reason) => {
    const targetReq = requisitions.find((r) => r.id === reqId);
    const approverName = currentUser?.name || 'Dr. Manoj Patil';
    const approverPrn = currentUser?.prn || 'T100460';
    const res = await custodyApi.rejectRequisition(reqId, reason, approverName, approverPrn);
    if (res.ok) {
      setRequisitions((prev) =>
        prev.map((r) =>
          r.id === reqId
            ? { ...r, status: 'Rejected', supervisorNotes: reason }
            : r
        )
      );

      try {
        window.dispatchEvent(new CustomEvent('labtrack-requisition-updated', { detail: { id: reqId, status: 'Rejected' } }));
      } catch (e) {}

      try {
        await fetch('/api/notifications/requisition-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'REQUISITION_REJECTED',
            request_id: reqId,
            student_name: targetReq?.studentName || 'Ishaan Chand',
            student_prn: targetReq?.studentPrn || '25070126076',
            project_name: targetReq?.projectTitle || 'Autonomous Quadruped Vision Robot',
            mentor_name: approverName,
            technical_purpose: `Rejection reason: ${reason}`,
            components: targetReq?.componentsRequested || [],
          }),
        });
      } catch (err) {
        console.warn('Backend rejection dispatch warning:', err);
      }
      await loadData();
      notifyCrossTabSync();
      addToast({
        title: 'Requisition Rejected & Email Dispatched',
        message: `Requisition ${reqId} rejected. Notification recorded and sent to student.`,
        type: 'warning',
      });
    }
  };

  const deleteRequisition = async (reqId) => {
    const res = await custodyApi.deleteRequisition(reqId, currentUser?.name || 'Ishaan Chand', currentUser?.prn || '25070126076');
    if (res.ok) {
      const targetKey = String(reqId || '').trim().toLowerCase();
      setRequisitions((prev) =>
        prev.filter((r) => String(r.id || '').trim().toLowerCase() !== targetKey && String(r.requestNumber || '').trim().toLowerCase() !== targetKey)
      );
      try {
        const stored = JSON.parse(localStorage.getItem('labtrack_requisitions_v15') || '[]');
        const updated = stored.filter((r) => String(r.id || '').trim().toLowerCase() !== targetKey && String(r.requestNumber || '').trim().toLowerCase() !== targetKey);
        localStorage.setItem('labtrack_requisitions_v15', JSON.stringify(updated));
      } catch (e) {}

      try {
        window.dispatchEvent(new CustomEvent('labtrack-requisition-updated', {
          detail: { id: reqId, status: 'Cancelled' }
        }));
      } catch (e) {}

      notifyCrossTabSync();
      addToast({
        title: 'Requisition Cancelled',
        message: `Order #${reqId} has been successfully deleted from queue before approval.`,
        type: 'info',
      });
      return true;
    }
    return false;
  };

  const modifyRequisitionQuantity = async (reqId, itemIndex, newQty) => {
    const res = await custodyApi.modifyQuantity(reqId, itemIndex, newQty);
    if (res.ok) {
      await loadData();
      notifyCrossTabSync();
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
      notifyCrossTabSync();
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
      const dispatchedTag = payload.assetTag;
      // Mark physical asset as IN_USE
      setAssets((prev) => {
        const next = prev.map((a) =>
          a.barcode === dispatchedTag || a.assetTag === dispatchedTag
            ? { ...a, state: 'IN_USE', custodyHolderPrn: payload.studentPrn }
            : a
        );
        try {
          localStorage.setItem('labtrack_assets_v15', JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      // update item status in inventory
      await inventoryApi.updateStockStatus(payload.assetTag, 'Allocated', {
        prn: payload.studentPrn,
        name: payload.studentName,
        projectId: payload.projectId,
        dueDate: payload.dueDate || '2026-10-29',
      });

      if (payload.requisitionId) {
        setRequisitions((prev) =>
          prev.map((r) =>
            r.id === payload.requisitionId || r.requestNumber === payload.requisitionId
              ? { ...r, status: 'Dispatched', stage: 'Dispatched & In Custody' }
              : r
          )
        );

        try {
          window.dispatchEvent(new CustomEvent('labtrack-requisition-updated', {
            detail: { id: payload.requisitionId, status: 'Dispatched' }
          }));
        } catch (e) {}

        try {
          await fetch('/api/notifications/requisition-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'REQUISITION_DISPATCHED',
              request_id: payload.requisitionId,
              student_name: payload.studentName || 'Ishaan Chand',
              student_prn: payload.studentPrn || '25070126076',
              project_name: payload.projectId || 'Autonomous Quadruped Vision Robot',
              mentor_name: 'Counter Desk 2 (Staff)',
              technical_purpose: `Physical handover committed. Asset ${payload.assetTag} (${payload.nomenclature}) in student custody.`,
              components: [{ nomenclature: payload.nomenclature, quantity: 1, itemId: payload.itemId }],
            }),
          });
        } catch (e) {}
      }

      await loadData();
      notifyCrossTabSync();

      addToast({
        title: 'Hardware Dispatched & Loan Active',
        message: `Asset ${payload.assetTag} checked out to PRN ${payload.studentPrn}. Transaction committed into student custody.`,
        type: 'success',
      });
      return true;
    }
    return false;
  };

  const executeReturn = async (loanId, conditionChecklist, returnType, defectDetails) => {
    const res = await custodyApi.executeCheckinReturn(loanId, conditionChecklist, returnType, defectDetails);
    if (res.ok) {
      const loan = res.data?.loan;
      const returnedAssetTag = loan?.assetTag;

      setAssets((prev) => {
        const next = prev.map((a) =>
          a.barcode === returnedAssetTag || a.assetTag === returnedAssetTag
            ? { ...a, state: returnType === 'defect' ? 'DEFECTIVE' : 'AVAILABLE', custodyHolderPrn: null }
            : a
        );
        try {
          localStorage.setItem('labtrack_assets_v15', JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      if (returnType === 'defect' && loan) {
        // Log defect
        await accountabilityApi.logDefect({
          assetTag: loan.assetTag,
          nomenclature: loan.nomenclature,
          studentPrn: loan.borrowerPrn,
          projectId: loan.projectId,
          severity: defectDetails?.severity || 'Moderate',
          defectCategory: defectDetails?.defectCategory || 'Check-in Inspection Failure',
          conditionSummary: defectDetails?.conditionSummary || defectDetails?.description || 'Hardware failed counter physical test',
          actionPlan: 'Routed to triage bench for diagnostic inspection and repair',
        });

        // Mark physical asset state as DEFECTIVE
        setAssets((prev) =>
          prev.map((a) =>
            a.barcode === returnedAssetTag || a.assetTag === returnedAssetTag
              ? { ...a, state: 'DEFECTIVE', custodyHolderPrn: null }
              : a
          )
        );

        // Update inventory: good decrements, bad increments, preserving total = good + bad
        await inventoryApi.updateStockStatus(loan.assetTag, 'Maintenance', null);
      } else if (loan) {
        // Clean return restock
        setAssets((prev) =>
          prev.map((a) =>
            a.barcode === returnedAssetTag || a.assetTag === returnedAssetTag
              ? { ...a, state: 'AVAILABLE', custodyHolderPrn: null }
              : a
          )
        );
        await inventoryApi.updateStockStatus(loan.assetTag, 'Available', null);
      }

      await loadData();

      // Reconcile and update tied requisition
      const targetReq = requisitions.find(
        (r) =>
          (loan?.requisitionId && (r.id === loan.requisitionId || r.requestNumber === loan.requisitionId)) ||
          ((r.studentPrn === loan?.borrowerPrn || r.borrowerPrn === loan?.borrowerPrn) &&
           (r.status === 'Dispatched' || r.stage?.includes('Dispatched') || r.status?.toLowerCase().includes('dispatch')))
      );
      const targetReqId = targetReq?.id || targetReq?.requestNumber || loan?.requisitionId;

      if (targetReqId) {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
        setRequisitions((prev) => {
          const next = prev.map((r) => {
            if (r.id === targetReqId || r.requestNumber === targetReqId) {
              const existingTimeline = (r.timeline || []).filter((s) => !(s.step || '').toLowerCase().includes('return'));
              return {
                ...r,
                status: 'Returned',
                stage: 'Returned & Restocked',
                timeline: [
                  ...existingTimeline,
                  {
                    step: 'Returned & Restocked',
                    stage: 'Returned',
                    completed: true,
                    timestamp: now,
                    actor: 'Ramesh Patil (Lab Assistant)',
                    note: `Hardware (${returnedAssetTag}) checked back into depot. Inventory balance restocked (+1). ${returnType === 'clean' ? 'Verified operational.' : 'Defect logged on intake.'}`,
                  },
                ],
              };
            }
            return r;
          });
          try {
            localStorage.setItem('labtrack_requisitions_v15', JSON.stringify(next));
          } catch (e) {}
          return next;
        });

        try {
          window.dispatchEvent(
            new CustomEvent('labtrack-requisition-updated', {
              detail: { id: targetReqId, status: 'Returned' },
            })
          );
        } catch (e) {}

        try {
          await fetch('/api/notifications/requisition-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'REQUISITION_RETURNED',
              request_id: targetReqId,
              student_name: loan?.borrowerName || targetReq?.studentName || 'Ishaan Chand',
              student_prn: loan?.borrowerPrn || targetReq?.studentPrn || '25070126076',
              project_name: loan?.projectId || targetReq?.projectTitle || 'Autonomous Quadruped Vision Robot',
              mentor_name: 'Counter Desk 2 (Staff)',
              technical_purpose: `Hardware intake completed. Asset ${returnedAssetTag} returned & restocked to depot inventory pool.`,
              components: [{ nomenclature: loan?.nomenclature || 'Hardware Item', quantity: 1, itemId: returnedAssetTag }],
            }),
          });
        } catch (e) {}
      }

      await loadData();
      notifyCrossTabSync();
      addToast({
        title: returnType === 'clean' ? 'Clean Return Accepted' : 'Defect Logged on Return',
        message: returnType === 'clean'
          ? 'Hardware restocked to inventory pool. Requisition marked Returned & Restocked.'
          : 'Asset marked defective: Good stock decremented, Defective stock incremented (Total preserved).',
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
        const defect = defects.find((d) => d.id === defectId);
        if (defect) {
          setAssets((prev) =>
            prev.map((a) =>
              a.barcode === defect.assetTag || a.assetTag === defect.assetTag
                ? { ...a, state: 'AVAILABLE' }
                : a
            )
          );
          await inventoryApi.updateStockStatus(defect.assetTag, 'Available', null);
        }
      }
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
      const defect = defects.find((d) => d.id === defectId);
      if (defect) {
        setAssets((prev) =>
          prev.map((a) =>
            a.barcode === defect.assetTag || a.assetTag === defect.assetTag
              ? { ...a, state: 'DECOMMISSIONED' }
              : a
          )
        );
      }
      await loadData();
      addToast({
        title: 'Asset Permanently Retired',
        message: `Hardware decommissioned from active institutional registry and written off stock.`,
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
        // Physical Assets & Barcode Resolution
        assets,
        setAssets,
        resolveBarcode,
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
        deleteRequisition,
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
        resolveItemLocationForDept,
        // Backward compatibility
        selectedFacility: `${selectedDepartment} DEPT`,
        setSelectedFacility: (fac) => {
          const raw = String(fac).replace(' DEPT', '').replace(' LAB', '').replace('S', '').trim();
          changeDepartment(raw);
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
