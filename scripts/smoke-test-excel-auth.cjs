const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🧪 LABTRACK EXCEL AUTHENTICATION SMOKE TEST SUITE');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`✅ [PASS] ${testName} ${details}`);
    passCount++;
  } else {
    console.error(`❌ [FAIL] ${testName} ${details}`);
    failCount++;
  }
}

// ─────────────────────────────────────────────────────────────
// TEST 1: Excel File Existence & Workbook Parsing
// ─────────────────────────────────────────────────────────────
const excelPath = path.join(__dirname, '..', 'public', 'data', 'labtrack_auth_roster.xlsx');
assert(fs.existsSync(excelPath), 'Test 1: labtrack_auth_roster.xlsx exists on disk', `(${excelPath})`);

const workbook = XLSX.readFile(excelPath);
assert(workbook.SheetNames.length > 0, 'Test 2: Workbook contains at least one worksheet', `(Sheet: ${workbook.SheetNames[0]})`);

const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);
assert(Array.isArray(rows) && rows.length >= 4, 'Test 3: Sheet parses successfully with at least 4 baseline institutional accounts', `(Found: ${rows.length} rows)`);

// Verify required schema keys
const sample = rows[0];
const hasSchema = 'PRN_ID' in sample && 'FullName' in sample && 'Role' in sample && 'Password' in sample && 'Status' in sample;
assert(hasSchema, 'Test 4: Sheet conforms to required schema (PRN_ID, FullName, Role, Password, Status)');

// ─────────────────────────────────────────────────────────────
// Normalization and Validation Logic (matching excelAuthService)
// ─────────────────────────────────────────────────────────────
function validateExcelAuth(roster, inputId, inputPassword) {
  const cleanId = String(inputId || '').trim().toLowerCase();
  const cleanPass = String(inputPassword || '').trim();

  const match = roster.find((u) => String(u.PRN_ID).trim().toLowerCase() === cleanId);
  if (!match) {
    return { success: false, error: `ID "${inputId}" was not found in institutional Excel roster.` };
  }
  if (match.Status && match.Status.toLowerCase() !== 'active') {
    return { success: false, error: `Account ${match.PRN_ID} is inactive.` };
  }
  if (match.Password && match.Password !== cleanPass) {
    return { success: false, error: 'Invalid password. Please check your credentials.' };
  }
  return { success: true, user: match };
}

// ─────────────────────────────────────────────────────────────
// TEST 5-8: Canonical Institutional Role Authentication
// ─────────────────────────────────────────────────────────────
// Student
const studentAuth = validateExcelAuth(rows, '202401048', 'password123');
assert(studentAuth.success && studentAuth.user.Role === 'Student' && studentAuth.user.FullName === 'Rahul Sharma', 'Test 5: Student PRN (202401048) authenticates successfully');

// Faculty
const facultyAuth = validateExcelAuth(rows, 'FAC-AI-019', 'password123');
assert(facultyAuth.success && facultyAuth.user.Role === 'Faculty' && studentAuth.user.FullName.length > 0, 'Test 6: Faculty Staff ID (FAC-AI-019) authenticates successfully');

// Lab Assistant
const assistantAuth = validateExcelAuth(rows, 'LA-04', 'password123');
assert(assistantAuth.success && assistantAuth.user.Role === 'Lab Assistant', 'Test 7: Lab Assistant ID (LA-04) authenticates successfully');

// HoD / Admin
const adminAuth = validateExcelAuth(rows, 'HOD-AIML-001', 'password123');
assert(adminAuth.success && adminAuth.user.Role === 'HoD / Admin', 'Test 8: HoD / Admin ID (HOD-AIML-001) authenticates successfully');

// ─────────────────────────────────────────────────────────────
// TEST 9-10: Negative Scenarios (Rejection Integrity)
// ─────────────────────────────────────────────────────────────
// Invalid PRN
const invalidIdAuth = validateExcelAuth(rows, 'NON_EXISTENT_PRN_9999', 'password123');
assert(!invalidIdAuth.success && invalidIdAuth.error.includes('not found'), 'Test 9: Unknown PRN is rejected gracefully with clear error message');

// Wrong Password
const wrongPassAuth = validateExcelAuth(rows, '202401048', 'incorrect_pwd_888');
assert(!wrongPassAuth.success && wrongPassAuth.error.includes('Invalid password'), 'Test 10: Wrong password for valid PRN is rejected with security error');

// ─────────────────────────────────────────────────────────────
// TEST 11: Excel Audit Export Generation
// ─────────────────────────────────────────────────────────────
const auditLogs = [
  { Timestamp: new Date().toISOString(), PRN_ID: '202401048', Role: 'Student', AuthenticationResult: 'SUCCESS' },
  { Timestamp: new Date().toISOString(), PRN_ID: 'INVALID_USER', Role: 'Student', AuthenticationResult: 'FAILED' },
];
const auditWb = XLSX.utils.book_new();
const auditWs = XLSX.utils.json_to_sheet(auditLogs);
XLSX.utils.book_append_sheet(auditWb, auditWs, 'AuditLog');
const testAuditPath = path.join(__dirname, '..', 'public', 'data', 'test_audit_output.xlsx');
XLSX.writeFile(auditWb, testAuditPath);
assert(fs.existsSync(testAuditPath), 'Test 11: Generating and exporting audit log to Excel workbook succeeds');
fs.unlinkSync(testAuditPath); // clean up test artifact

// ─────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────
console.log('\n----------------------------------------------------');
console.log(`SMOKE TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED (TOTAL: ${passCount + failCount})`);
console.log('----------------------------------------------------');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL EXCEL AUTHENTICATION SMOKE TESTS PASSED WITH 100% SUCCESS!\n');
}
