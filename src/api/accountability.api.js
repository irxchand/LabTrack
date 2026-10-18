import { apiClient } from './client';
import {
  INITIAL_DEFECT_LOGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_INCIDENT_LEDGER,
  INITIAL_PROJECTS
} from '../data/mockData';

const DEFECTS_KEY = 'labtrack_defects_v5';
const AUDIT_KEY = 'labtrack_audit_v5';
const INCIDENTS_KEY = 'labtrack_incidents_v5';
const PROJECTS_KEY = 'labtrack_projects_v5';

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

function appendAudit(action, targetId, details, actorRole = 'Staff', actorPrn = 'STAFF-L2-004') {
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

export const accountabilityApi = {
  // RELIABILITY & SCORECARD
  getStudentReliability: async (prn = '202401048') => {
    return apiClient.simulatedFetch('GET_RELIABILITY_SCORE', () => {
      // Aryan Sharma has score 94; Vikram Joshi has score 68; Pooja Varma has 78
      let score = 94;
      if (prn === '202409912') score = 68;
      if (prn === '202302882') score = 78;
      if (prn === '202301140') score = 72;

      let tier = 'High Compliance';
      if (score < 75) tier = 'Flagged';
      else if (score < 90) tier = 'Satisfactory Compliance';

      return {
        score,
        tier,
        metrics: {
          allocationHistory: 14,
          onTimeRate: 92.8,
          damageDefectIncidents: 0,
          pendingReturns: 2,
          termDaysActive: 45,
        },
        thresholds: {
          flaggedBelow: 75,
          satisfactoryBelow: 90,
          highAbove: 90,
        },
      };
    });
  },

  getIncidentLedger: async () => {
    return apiClient.simulatedFetch('GET_INCIDENT_LEDGER', () => {
      return getStored(INCIDENTS_KEY, INITIAL_INCIDENT_LEDGER);
    });
  },

  // AUDIT LOG
  getAuditLogs: async () => {
    return apiClient.simulatedFetch('GET_AUDIT_LOGS', () => {
      return getStored(AUDIT_KEY, INITIAL_AUDIT_LOGS);
    });
  },

  // DEFECT TRIAGE
  getDefects: async () => {
    return apiClient.simulatedFetch('GET_DEFECT_LOGS', () => {
      return getStored(DEFECTS_KEY, INITIAL_DEFECT_LOGS);
    });
  },

  logDefect: async (defectData) => {
    return apiClient.simulatedFetch('LOG_NEW_DEFECT', () => {
      const defects = getStored(DEFECTS_KEY, INITIAL_DEFECT_LOGS);
      const newDefect = {
        id: `DEF-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        assetTag: defectData.assetTag,
        nomenclature: defectData.nomenclature,
        reportedDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        inspectorPrn: 'STAFF-L2-004',
        inspectorName: 'Ramesh Patil',
        associatedPrn: defectData.studentPrn || '202401048',
        associatedProject: defectData.projectId || 'PRJ-AIML-08',
        severity: defectData.severity || 'Moderate',
        defectCategory: defectData.defectCategory || 'Physical Damage',
        conditionSummary: defectData.conditionSummary || 'Flagged during counter return checklist',
        repairStatus: 'Under Inspection',
        actionPlan: defectData.actionPlan || 'Initial diagnosis by electronics lab custodian',
        isRetired: false,
      };
      saveStored(DEFECTS_KEY, [newDefect, ...defects]);
      appendAudit('DEFECT_LOGGED', newDefect.id, `Reported ${newDefect.severity} defect on ${newDefect.assetTag}`, 'Lab Assistant', 'STAFF-L2-004');
      return newDefect;
    });
  },

  updateRepairStatus: async (defectId, repairStatus, actionPlan) => {
    return apiClient.simulatedFetch('UPDATE_REPAIR_STATUS', () => {
      const defects = getStored(DEFECTS_KEY, INITIAL_DEFECT_LOGS);
      const idx = defects.findIndex((d) => d.id === defectId);
      if (idx !== -1) {
        defects[idx].repairStatus = repairStatus;
        if (actionPlan) defects[idx].actionPlan = actionPlan;
        saveStored(DEFECTS_KEY, defects);
        appendAudit('DEFECT_STATUS_UPDATED', defectId, `Status transitioned to ${repairStatus}`, 'Lab Assistant', 'STAFF-L2-004');
        return defects[idx];
      }
      return null;
    });
  },

  retireAsset: async (defectId) => {
    return apiClient.simulatedFetch('RETIRE_ASSET', () => {
      const defects = getStored(DEFECTS_KEY, INITIAL_DEFECT_LOGS);
      const idx = defects.findIndex((d) => d.id === defectId);
      if (idx !== -1) {
        defects[idx].repairStatus = 'Decommissioned';
        defects[idx].isRetired = true;
        saveStored(DEFECTS_KEY, defects);
        appendAudit('ASSET_RETIRED', defects[idx].assetTag, `Permanently decommissioned damaged hardware from department registry`, 'HoD / Admin', 'HOD-AIML-001');
        return defects[idx];
      }
      return null;
    });
  },

  // PROJECTS
  getProjects: async () => {
    return apiClient.simulatedFetch('GET_PROJECTS', () => {
      return getStored(PROJECTS_KEY, INITIAL_PROJECTS);
    });
  },

  getProjectById: async (projectId) => {
    return apiClient.simulatedFetch('GET_PROJECT_DOSSIER', () => {
      const projects = getStored(PROJECTS_KEY, INITIAL_PROJECTS);
      return projects.find((p) => p.id === projectId) || null;
    });
  },

  createProject: async (projectData) => {
    return apiClient.simulatedFetch('CREATE_PROJECT', () => {
      const projects = getStored(PROJECTS_KEY, INITIAL_PROJECTS);
      const newProject = {
        id: `PRJ-AIML-${Math.floor(20 + Math.random() * 80)}`,
        title: projectData.title,
        courseCode: projectData.courseCode || 'DCDS-SY-AIML',
        academicTerm: projectData.academicTerm || 'Autumn 2026 (Semester III)',
        department: projectData.department || 'Artificial Intelligence & Machine Learning',
        mentorId: projectData.mentorId || 'T100458',
        mentorName: projectData.mentorName || 'Dr. Meenakshi Sharma',
        teamLeaderPrn: projectData.teamLeaderPrn || '202401048',
        members: projectData.members || [],
        hardwareBudgetCap: projectData.hardwareBudgetCap || 3,
        currentAllocatedCount: 0,
        reliabilityScore: 95.0,
        allocatedItems: [],
        abstract: projectData.abstract || 'Academic hardware research and laboratory project.',
      };
      const updated = [newProject, ...projects];
      saveStored(PROJECTS_KEY, updated);
      appendAudit('PROJECT_REGISTERED', newProject.id, `Created project group: ${newProject.title} with ${newProject.members.length} members`, 'Student', newProject.teamLeaderPrn);
      return newProject;
    });
  },
};
