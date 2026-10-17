/**
 * Faculty Authorization & Scope Verification Utilities
 * 
 * Strict Domain Rule:
 * A faculty member can ONLY add/allocate hardware to:
 *  1. Their own faculty research lab (where they are designated PI / Faculty Lead).
 *  2. Student teams under their mentorship wing (where their name matches the mentor).
 * All other faculty facilities and other faculty's student teams must remain strictly View-Only.
 */

export function normalizeName(name) {
  if (!name || typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .replace(/^(dr\.|prof\.|mr\.|mrs\.|ms\.)\s*/i, '')
    .trim();
}

/**
 * Checks if the current faculty member is the designated mentor of a student project.
 * Returns false unconditionally for faculty research projects.
 */
export function isMentorOfProject(project, currentUser) {
  if (!project || project.isFacultyProject || !currentUser) return false;

  const cleanMentor = normalizeName(project.mentorName);
  const cleanUser = normalizeName(currentUser.name);

  // If both mentorName and current user name exist, enforce strict name matching
  if (cleanMentor && cleanUser) {
    if (!cleanMentor.includes(cleanUser) && !cleanUser.includes(cleanMentor)) {
      return false; // Direct mismatch: Cannot adopt another professor's student team!
    }
    return true;
  }

  // Fallback to PRN only if mentorName was absent
  if (project.mentorId && currentUser.prn && project.mentorId === currentUser.prn) {
    return true;
  }

  return false;
}

/**
 * Checks if the current faculty member is the Principal Investigator / Faculty Lead
 * of a faculty research project.
 */
export function isFacultyLeadOfProject(project, currentUser) {
  if (!project || !project.isFacultyProject || !currentUser) return false;

  const cleanLead = normalizeName(project.facultyLead || project.mentorName);
  const cleanUser = normalizeName(currentUser.name);

  // If lead name exists, enforce strict name matching
  if (cleanLead && cleanUser) {
    if (!cleanLead.includes(cleanUser) && !cleanUser.includes(cleanLead)) {
      return false; // Direct mismatch: Cannot manage another professor's research facility!
    }
    return true;
  }

  // Fallback checks if name not explicitly on project
  if (project.teamLeaderPrn && currentUser.prn && project.teamLeaderPrn === currentUser.prn) return true;
  if (project.mentorId && currentUser.prn && project.mentorId === currentUser.prn) return true;
  if (project.id && currentUser.projectId && project.id === currentUser.projectId) return true;

  return false;
}

/**
 * Determines if a faculty member has authority to allocate hardware or mutate a project.
 */
export function canFacultyAllocateToProject(project, currentUser) {
  if (!currentUser || currentUser.role !== 'Faculty') return false;
  return isFacultyLeadOfProject(project, currentUser) || isMentorOfProject(project, currentUser);
}

/**
 * Checks if a requisition belongs to a team mentored by the current faculty member.
 */
export function isRequisitionMentoredByUser(requisition, currentUser) {
  if (!requisition || !currentUser) return false;

  const cleanReqMentor = normalizeName(requisition.mentorName);
  const cleanUser = normalizeName(currentUser.name);

  if (cleanReqMentor && cleanUser) {
    if (!cleanReqMentor.includes(cleanUser) && !cleanUser.includes(cleanReqMentor)) {
      return false;
    }
    return true;
  }

  if (requisition.mentorId && currentUser.prn && requisition.mentorId === currentUser.prn) {
    return true;
  }

  return false;
}
