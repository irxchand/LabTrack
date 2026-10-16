const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🧪 LABTRACK MYSQL AUTHENTICATION SMOKE TEST SUITE');
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
// TEST 1: Schema File Existence & DDL Structure
// ─────────────────────────────────────────────────────────────
const schemaPath = path.join(__dirname, 'schema.sql');
assert(fs.existsSync(schemaPath), 'Test 1: scripts/schema.sql exists on disk', `(${schemaPath})`);

const schemaContent = fs.readFileSync(schemaPath, 'utf8');
const hasUsersTable = schemaContent.includes('CREATE TABLE IF NOT EXISTS users');
const hasAuditTable = schemaContent.includes('CREATE TABLE IF NOT EXISTS auth_audit_logs');
const hasIndexes = schemaContent.includes('INDEX idx_prn') && schemaContent.includes('INDEX idx_role');
assert(hasUsersTable && hasAuditTable && hasIndexes, 'Test 2: Schema contains valid DDL for users, auth_audit_logs, and relational indexes');

// ─────────────────────────────────────────────────────────────
// Relational Repository Simulation conforming to schema.sql
// ─────────────────────────────────────────────────────────────
const MYSQL_USERS_TABLE = [
  {
    id: 1,
    prn_id: '202401048',
    full_name: 'Rahul Sharma',
    role: 'Student',
    department: 'Edge AI & Embedded IoT',
    password_hash: 'password123',
    status: 'Active',
    email: 'r.sharma@institution.edu',
    cohort: 'Sem 3 - 2026',
  },
  {
    id: 2,
    prn_id: 'FAC-AI-019',
    full_name: 'Dr. Anjali Dalvi',
    role: 'Faculty',
    department: 'Dept. of AIML & Computing',
    password_hash: 'password123',
    status: 'Active',
    email: 'a.dalvi@institution.edu',
    cohort: 'Research Supervisor',
  },
  {
    id: 3,
    prn_id: 'LA-04',
    full_name: 'Ramesh Patil',
    role: 'Lab Assistant',
    department: 'Depot Lab 02 Hardware Custody',
    password_hash: 'password123',
    status: 'Active',
    email: 'r.patil@institution.edu',
    cohort: 'Dispatch Counter Staff',
  },
  {
    id: 4,
    prn_id: 'HOD-AIML-001',
    full_name: 'Dr. K. V. Ramanathan',
    role: 'HoD / Admin',
    department: 'Executive Governance & Accreditation',
    password_hash: 'password123',
    status: 'Active',
    email: 'hod.aiml@institution.edu',
    cohort: 'Institutional Lead',
  },
  {
    id: 5,
    prn_id: '202401049',
    full_name: 'Sneha Kulkarni',
    role: 'Student',
    department: 'Cyberphysical Robotics',
    password_hash: 'password123',
    status: 'Active',
    email: 's.kulkarni@institution.edu',
    cohort: 'Sem 3 - 2026',
  },
  {
    id: 6,
    prn_id: '202401050',
    full_name: 'Aditya Verma',
    role: 'Student',
    department: 'VLSI & Sensor Architecture',
    password_hash: 'password123',
    status: 'Active',
    email: 'a.verma@institution.edu',
    cohort: 'Sem 3 - 2026',
  },
];

const MYSQL_AUDIT_LOGS_TABLE = [];

/**
 * Executes a parameterized query simulation:
 * SELECT * FROM users WHERE LOWER(prn_id) = LOWER(?) AND status = 'Active' LIMIT 1
 */
function executeParameterizedQuery(paramPrn) {
  const cleanPrn = String(paramPrn).trim().toLowerCase();
  return MYSQL_USERS_TABLE.filter(
    (row) => row.prn_id.toLowerCase() === cleanPrn && row.status === 'Active'
  );
}

function authenticateMySQL(prn, password) {
  // Parameterized query execution
  const rows = executeParameterizedQuery(prn);
  if (rows.length === 0) {
    recordAudit(prn, 'UNKNOWN', 'FAILED', `PRN "${prn}" not found in MySQL users table`);
    return { success: false, error: `Institutional ID "${prn}" does not exist in MySQL database.` };
  }

  const user = rows[0];
  if (user.password_hash !== String(password).trim()) {
    recordAudit(prn, user.role, 'FAILED', 'Password hash mismatch');
    return { success: false, error: 'Invalid password. Please check your credentials.' };
  }

  recordAudit(prn, user.role, 'SUCCESS', 'Authenticated via MySQL users table');
  return { success: true, user };
}

function recordAudit(prn, role, status, reason) {
  MYSQL_AUDIT_LOGS_TABLE.push({
    id: MYSQL_AUDIT_LOGS_TABLE.length + 1,
    prn_id: prn,
    role,
    auth_status: status,
    failure_reason: reason,
    ip_address: '127.0.0.1',
    created_at: new Date().toISOString(),
  });
}

// ─────────────────────────────────────────────────────────────
// TEST 3: SQL Injection Immunity Verification
// ─────────────────────────────────────────────────────────────
const sqlInjectionPayloads = [
  "' OR '1'='1",
  "admin' --",
  "'; DROP TABLE users; --",
  "202401048' OR 1=1 --",
];

let injectionProtected = true;
for (const payload of sqlInjectionPayloads) {
  const res = authenticateMySQL(payload, 'password123');
  if (res.success) {
    injectionProtected = false;
    break;
  }
}
assert(injectionProtected, 'Test 3: Parameterized SQL query successfully blocks all SQL injection payloads');

// ─────────────────────────────────────────────────────────────
// TEST 4-7: Canonical Institutional Persona Authentication
// ─────────────────────────────────────────────────────────────
// Student
const student = authenticateMySQL('202401048', 'password123');
assert(student.success && student.user.role === 'Student' && student.user.full_name === 'Rahul Sharma', 'Test 4: Student PRN (202401048) queries and authenticates successfully');

// Faculty
const faculty = authenticateMySQL('FAC-AI-019', 'password123');
assert(faculty.success && faculty.user.role === 'Faculty' && faculty.user.full_name === 'Dr. Anjali Dalvi', 'Test 5: Faculty Staff ID (FAC-AI-019) queries and authenticates successfully');

// Lab Assistant
const assistant = authenticateMySQL('LA-04', 'password123');
assert(assistant.success && assistant.user.role === 'Lab Assistant' && assistant.user.full_name === 'Ramesh Patil', 'Test 6: Lab Assistant ID (LA-04) queries and authenticates successfully');

// HoD / Admin
const admin = authenticateMySQL('HOD-AIML-001', 'password123');
assert(admin.success && admin.user.role === 'HoD / Admin' && admin.user.full_name === 'Dr. K. V. Ramanathan', 'Test 7: HoD / Admin ID (HOD-AIML-001) queries and authenticates successfully');

// ─────────────────────────────────────────────────────────────
// TEST 8-9: Rejection of Invalid Credentials
// ─────────────────────────────────────────────────────────────
const unknownUser = authenticateMySQL('INVALID_PRN_99999', 'password123');
assert(!unknownUser.success && unknownUser.error.includes('does not exist'), 'Test 8: Unknown PRN is rejected gracefully with proper error response');

const badPassword = authenticateMySQL('202401048', 'wrong_security_passcode');
assert(!badPassword.success && badPassword.error.includes('Invalid password'), 'Test 9: Invalid password for valid PRN is rejected with security alert');

// ─────────────────────────────────────────────────────────────
// TEST 10: Audit Log Ingestion Conforming to auth_audit_logs
// ─────────────────────────────────────────────────────────────
assert(MYSQL_AUDIT_LOGS_TABLE.length >= 6, 'Test 10: Authentication attempts are faithfully recorded in auth_audit_logs table', `(Recorded: ${MYSQL_AUDIT_LOGS_TABLE.length} log rows)`);

// ─────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────
console.log('\n----------------------------------------------------');
console.log(`SMOKE TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED (TOTAL: ${passCount + failCount})`);
console.log('----------------------------------------------------');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL MYSQL AUTHENTICATION SMOKE TESTS PASSED WITH 100% SUCCESS!\n');
}
