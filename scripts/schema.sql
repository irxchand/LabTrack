-- =====================================================================
-- LABTRACK PLATFORM // RELATIONAL DATABASE SCHEMA (MySQL 8.0+)
-- Institutional Hardware Lifecycle, Custody, & Authentication
-- Security Standard: NIST SP 800-53 Access Control
-- =====================================================================

CREATE DATABASE IF NOT EXISTS labtrack_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE labtrack_db;

-- ---------------------------------------------------------------------
-- 1. USERS & INSTITUTIONAL ACCOUNTS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prn_id VARCHAR(64) NOT NULL UNIQUE COMMENT 'Unique Institutional ID / PRN',
  full_name VARCHAR(128) NOT NULL COMMENT 'Legal Full Name',
  role ENUM('Student', 'Faculty', 'Lab Assistant', 'HoD / Admin') NOT NULL COMMENT 'Operational Access Role',
  department VARCHAR(128) NOT NULL COMMENT 'Academic or Administrative Department',
  password_hash VARCHAR(255) NOT NULL COMMENT 'Hashed Passcode / Credential',
  status ENUM('Active', 'Inactive', 'Suspended') NOT NULL DEFAULT 'Active' COMMENT 'Account Lifecycle State',
  email VARCHAR(128) NOT NULL COMMENT 'Official Institutional Email',
  cohort VARCHAR(64) DEFAULT NULL COMMENT 'Academic Cohort or Supervisory Designation',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_prn (prn_id),
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. AUTHENTICATION & ACCESS AUDIT LOGS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS auth_audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prn_id VARCHAR(64) NOT NULL COMMENT 'Attempted PRN or Staff ID',
  role VARCHAR(64) DEFAULT NULL COMMENT 'Target Role',
  auth_status ENUM('SUCCESS', 'FAILED') NOT NULL COMMENT 'Authentication Result',
  failure_reason VARCHAR(255) DEFAULT NULL COMMENT 'Detailed Failure Diagnostics',
  ip_address VARCHAR(64) DEFAULT '127.0.0.1' COMMENT 'Source IP / Terminal Identifier',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_prn (prn_id),
  INDEX idx_audit_status (auth_status),
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. SEED DATA: CANONICAL INSTITUTIONAL ROLES & BATCH STUDENTS
-- ---------------------------------------------------------------------
INSERT INTO users (prn_id, full_name, role, department, password_hash, status, email, cohort)
VALUES
  (
    '202401048', 
    'Rahul Sharma', 
    'Student', 
    'Edge AI & Embedded IoT', 
    'password123', 
    'Active', 
    'r.sharma@institution.edu', 
    'Sem 3 - 2026'
  ),
  (
    'FAC-AI-019', 
    'Dr. Anjali Dalvi', 
    'Faculty', 
    'Dept. of AIML & Computing', 
    'password123', 
    'Active', 
    'a.dalvi@institution.edu', 
    'Research Supervisor'
  ),
  (
    'LA-04', 
    'Ramesh Patil', 
    'Lab Assistant', 
    'Depot Lab 02 Hardware Custody', 
    'password123', 
    'Active', 
    'r.patil@institution.edu', 
    'Dispatch Counter Staff'
  ),
  (
    'HOD-AIML-001', 
    'Dr. K. V. Ramanathan', 
    'HoD / Admin', 
    'Executive Governance & Accreditation', 
    'password123', 
    'Active', 
    'hod.aiml@institution.edu', 
    'Institutional Lead'
  ),
  (
    '202401049', 
    'Sneha Kulkarni', 
    'Student', 
    'Cyberphysical Robotics', 
    'password123', 
    'Active', 
    's.kulkarni@institution.edu', 
    'Sem 3 - 2026'
  ),
  (
    '202401050', 
    'Aditya Verma', 
    'Student', 
    'VLSI & Sensor Architecture', 
    'password123', 
    'Active', 
    'a.verma@institution.edu', 
    'Sem 3 - 2026'
  )
ON DUPLICATE KEY UPDATE 
  full_name = VALUES(full_name),
  role = VALUES(role),
  department = VALUES(department),
  status = VALUES(status),
  email = VALUES(email),
  cohort = VALUES(cohort);
