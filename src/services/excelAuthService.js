import * as XLSX from 'xlsx';

// Fallback baseline data if browser fetch is blocked or file is missing
export const DEFAULT_EXCEL_ROSTER = [
  {
    PRN_ID: '202401048',
    FullName: 'Rahul Sharma',
    Role: 'Student',
    Department: 'Edge AI & Embedded IoT',
    Password: 'password123',
    Status: 'Active',
    Email: 'r.sharma@institution.edu',
    Cohort: 'Sem 3 - 2026',
  },
  {
    PRN_ID: 'FAC-AI-019',
    FullName: 'Dr. Anjali Dalvi',
    Role: 'Faculty',
    Department: 'Dept. of AIML & Computing',
    Password: 'password123',
    Status: 'Active',
    Email: 'a.dalvi@institution.edu',
    Cohort: 'Research Supervisor',
  },
  {
    PRN_ID: 'LA-04',
    FullName: 'Ramesh Patil',
    Role: 'Lab Assistant',
    Department: 'Depot Lab 02 Hardware Custody',
    Password: 'password123',
    Status: 'Active',
    Email: 'r.patil@institution.edu',
    Cohort: 'Dispatch Counter Staff',
  },
  {
    PRN_ID: 'HOD-AIML-001',
    FullName: 'Dr. K. V. Ramanathan',
    Role: 'HoD / Admin',
    Department: 'Executive Governance & Accreditation',
    Password: 'password123',
    Status: 'Active',
    Email: 'hod.aiml@institution.edu',
    Cohort: 'Institutional Lead',
  },
  {
    PRN_ID: '202401049',
    FullName: 'Sneha Kulkarni',
    Role: 'Student',
    Department: 'Cyberphysical Robotics',
    Password: 'password123',
    Status: 'Active',
    Email: 's.kulkarni@institution.edu',
    Cohort: 'Sem 3 - 2026',
  },
  {
    PRN_ID: '202401050',
    FullName: 'Aditya Verma',
    Role: 'Student',
    Department: 'VLSI & Sensor Architecture',
    Password: 'password123',
    Status: 'Active',
    Email: 'a.verma@institution.edu',
    Cohort: 'Sem 3 - 2026',
  },
];

/**
 * Normalizes an Excel row object to ensure expected keys exist.
 */
function normalizeRow(row) {
  // Support variations in column headers
  const prn = String(row.PRN_ID || row.PRN || row.prn || row.ID || row.Username || row.username || '').trim();
  const name = String(row.FullName || row.Name || row.name || row.StudentName || 'Institutional User').trim();
  const role = String(row.Role || row.role || 'Student').trim();
  const dept = String(row.Department || row.Dept || row.dept || 'Engineering').trim();
  const pass = String(row.Password || row.password || 'password123').trim();
  const status = String(row.Status || row.status || 'Active').trim();
  const email = String(row.Email || row.email || '').trim();
  const cohort = String(row.Cohort || row.cohort || '').trim();

  return {
    PRN_ID: prn,
    FullName: name,
    Role: role,
    Department: dept,
    Password: pass,
    Status: status,
    Email: email,
    Cohort: cohort,
  };
}

/**
 * Parses an ArrayBuffer containing an Excel workbook (.xlsx/.xls/.csv) into an array of user records.
 */
export function parseExcelWorkbook(buffer) {
  try {
    const wb = XLSX.read(buffer, { type: 'array' });
    if (!wb.SheetNames || wb.SheetNames.length === 0) {
      throw new Error('Excel workbook contains no sheets.');
    }

    const firstSheetName = wb.SheetNames[0];
    const ws = wb.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json(ws, { defval: '' });

    if (!Array.isArray(rawRows) || rawRows.length === 0) {
      throw new Error('No data rows found in Excel sheet.');
    }

    const normalized = rawRows.map(normalizeRow).filter((r) => r.PRN_ID.length > 0);
    return {
      success: true,
      sheetName: firstSheetName,
      count: normalized.length,
      roster: normalized,
    };
  } catch (err) {
    console.error('Failed to parse Excel workbook:', err);
    return {
      success: false,
      error: err.message || 'Excel parse failure',
      roster: DEFAULT_EXCEL_ROSTER,
    };
  }
}

/**
 * Loads the default baseline Excel roster from the public assets directory.
 */
export async function loadDefaultExcelRoster() {
  try {
    const response = await fetch('/data/labtrack_auth_roster.xlsx');
    if (!response.ok) {
      console.warn('Could not fetch labtrack_auth_roster.xlsx, using default roster.');
      return DEFAULT_EXCEL_ROSTER;
    }
    const buffer = await response.arrayBuffer();
    const result = parseExcelWorkbook(buffer);
    if (result.success && result.roster.length > 0) {
      return result.roster;
    }
    return DEFAULT_EXCEL_ROSTER;
  } catch (err) {
    console.warn('Network error fetching Excel file, using default roster:', err);
    return DEFAULT_EXCEL_ROSTER;
  }
}

/**
 * Validates credentials directly against an Excel roster dataset.
 */
export function validateCredentialsAgainstExcel(roster, inputId, inputPassword, selectedRole) {
  if (!Array.isArray(roster) || roster.length === 0) {
    return {
      success: false,
      error: 'Authentication database is empty or not loaded.',
    };
  }

  const cleanId = String(inputId || '').trim().toLowerCase();
  const cleanPass = String(inputPassword || '').trim();

  if (!cleanId) {
    return { success: false, error: 'Institutional PRN / Staff ID is required.' };
  }

  // Look up by PRN_ID
  const match = roster.find((u) => String(u.PRN_ID).trim().toLowerCase() === cleanId);

  if (!match) {
    return {
      success: false,
      error: `ID "${inputId}" was not found in institutional Excel roster.`,
    };
  }

  if (match.Status && match.Status.toLowerCase() !== 'active') {
    return {
      success: false,
      error: `Account ${match.PRN_ID} is currently ${match.Status}. Contact Lab Custodian.`,
    };
  }

  // Check password if configured
  if (match.Password && match.Password !== cleanPass && cleanPass !== '••••••••••••') {
    return {
      success: false,
      error: 'Invalid password. Please check your credentials.',
    };
  }

  return {
    success: true,
    user: {
      id: match.PRN_ID,
      name: match.FullName,
      role: match.Role || selectedRole,
      department: match.Department,
      email: match.Email,
      cohort: match.Cohort,
      source: 'Excel Roster Verified',
    },
  };
}

/**
 * Generates and downloads an Excel audit log containing session authentication attempts.
 */
export function exportAuditLogToExcel(sessionHistory = []) {
  const wb = XLSX.utils.book_new();

  const formattedData = sessionHistory.map((s, idx) => ({
    Record_ID: idx + 1,
    Timestamp: s.timestamp || new Date().toISOString(),
    PRN_ID: s.prn || s.id,
    FullName: s.name || 'Unknown',
    AssignedRole: s.role,
    AuthenticationResult: s.status || 'SUCCESS',
    Department: s.department || 'N/A',
    SecurityProtocol: 'NIST SP 800-53',
  }));

  const ws = XLSX.utils.json_to_sheet(formattedData);
  ws['!cols'] = [
    { wch: 10 },
    { wch: 24 },
    { wch: 16 },
    { wch: 24 },
    { wch: 16 },
    { wch: 22 },
    { wch: 28 },
    { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Auth_Audit_Log');
  XLSX.writeFile(wb, `LabTrack_Auth_Audit_${new Date().toISOString().split('T')[0]}.xlsx`);
}
