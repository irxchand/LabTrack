const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const rosterData = [
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

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(rosterData);

ws['!cols'] = [
  { wch: 16 },
  { wch: 24 },
  { wch: 16 },
  { wch: 36 },
  { wch: 14 },
  { wch: 10 },
  { wch: 28 },
  { wch: 24 },
];

XLSX.utils.book_append_sheet(wb, ws, 'AuthRoster');

const publicDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const targetPath = path.join(publicDir, 'labtrack_auth_roster.xlsx');
XLSX.writeFile(wb, targetPath);
console.log('✅ Baseline Excel Auth Roster created at:', targetPath);
