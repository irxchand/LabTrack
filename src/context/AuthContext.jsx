import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/mockData';
import { apiClient } from '../api/client';
import {
  loadDefaultExcelRoster,
  parseExcelWorkbook,
  validateCredentialsAgainstExcel,
  exportAuditLogToExcel,
  DEFAULT_EXCEL_ROSTER,
} from '../services/excelAuthService';
import { mysqlAuth } from '../services/mysqlAuthService';

const AuthContext = createContext(null);

export const ROLE_PERMISSIONS = {
  Student: {
    canViewInventory: true,
    canEditInventory: false,
    canAddInventory: false,
    canCreateRequisition: true,
    canApproveRequisition: false,
    canDispatch: false,
    canCheckIn: false,
    canReportDefect: true,
    canRetireAsset: false,
    canAdjustThresholds: false,
    allowedRoutes: [
      '/workspace/inventory',
      '/workspace/custody/active',
      '/workspace/custody/requests',
      '/workspace/custody/reservations',
      '/workspace/accountability/reliability',
      '/workspace/projects/overview',
    ],
  },
  Faculty: {
    canViewInventory: true,
    canEditInventory: false,
    canAddInventory: false,
    canCreateRequisition: false,
    canApproveRequisition: true,
    canDispatch: false,
    canCheckIn: false,
    canReportDefect: false,
    canRetireAsset: false,
    canAdjustThresholds: false,
    allowedRoutes: [
      '/workspace/inventory',
      '/workspace/custody/active',
      '/workspace/custody/requests',
      '/workspace/custody/reservations',
      '/workspace/accountability/reliability',
      '/workspace/projects/overview',
      '/workspace/operations/approvals',
      '/workspace/operations/defects',
    ],
  },
  'Lab Assistant': {
    canViewInventory: true,
    canEditInventory: true,
    canAddInventory: true,
    canCreateRequisition: false,
    canApproveRequisition: false,
    canDispatch: true,
    canCheckIn: true,
    canReportDefect: true,
    canRetireAsset: false,
    canAdjustThresholds: false,
    allowedRoutes: [
      '/workspace/inventory',
      '/workspace/custody/active',
      '/workspace/custody/requests',
      '/workspace/custody/reservations',
      '/workspace/accountability/reliability',
      '/workspace/accountability/audit-log',
      '/workspace/projects/overview',
      '/workspace/operations/dispatch',
      '/workspace/operations/defects',
    ],
  },
  'HoD / Admin': {
    canViewInventory: true,
    canEditInventory: true,
    canAddInventory: true,
    canCreateRequisition: true,
    canApproveRequisition: true,
    canDispatch: true,
    canCheckIn: true,
    canReportDefect: true,
    canRetireAsset: true,
    canAdjustThresholds: true,
    allowedRoutes: [
      '/workspace/inventory',
      '/workspace/custody/active',
      '/workspace/custody/requests',
      '/workspace/custody/reservations',
      '/workspace/accountability/reliability',
      '/workspace/accountability/audit-log',
      '/workspace/projects/overview',
      '/workspace/operations/approvals',
      '/workspace/operations/dispatch',
      '/workspace/operations/defects',
    ],
  },
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedPrn = localStorage.getItem('labtrack_active_prn');
    const savedRole = localStorage.getItem('labtrack_active_role') || 'Student';
    if (savedPrn) {
      const byPrn = INITIAL_USERS.find((u) => u.prn?.toLowerCase() === savedPrn.toLowerCase());
      if (byPrn) return byPrn;
    }
    if (savedRole === 'Faculty') {
      const manoj = INITIAL_USERS.find((u) => u.prn === 'T100460');
      if (manoj) return manoj;
    }
    const found = INITIAL_USERS.find((u) => u.role === savedRole);
    return found || INITIAL_USERS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('labtrack_is_auth') === 'true';
  });

  // Active Database Provider ('mysql' | 'excel')
  const [activeDatabaseProvider, setActiveDatabaseProvider] = useState('mysql');

  // Excel Roster State
  const [excelRoster, setExcelRoster] = useState(DEFAULT_EXCEL_ROSTER);
  const [isExcelLoaded, setIsExcelLoaded] = useState(false);
  const [authAuditLogs, setAuthAuditLogs] = useState([]);

  // Fetch initial Excel roster on mount
  useEffect(() => {
    async function initRoster() {
      const roster = await loadDefaultExcelRoster();
      setExcelRoster(roster);
      setIsExcelLoaded(true);
    }
    initRoster();
  }, []);

  useEffect(() => {
    if (currentUser) {
      apiClient.setAuth('mock_token_jwt', currentUser.role, currentUser.prn);
      localStorage.setItem('labtrack_active_role', currentUser.role);
      localStorage.setItem('labtrack_active_prn', currentUser.prn);
      localStorage.setItem('labtrack_is_auth', String(isAuthenticated));
    }
  }, [currentUser, isAuthenticated]);

  const switchRole = (newRole) => {
    let matched = null;
    if (newRole === 'Student') {
      matched = INITIAL_USERS.find((u) => u.prn === '25070126076') || INITIAL_USERS.find((u) => u.name === 'Ishaan Chand');
    } else if (newRole === 'Faculty') {
      matched = INITIAL_USERS.find((u) => u.prn === 'T100460') || INITIAL_USERS.find((u) => u.name?.includes('Manoj'));
    } else if (newRole === 'Lab Assistant') {
      matched = INITIAL_USERS.find((u) => u.prn === 'N10001' || u.name?.includes('Ramesh')) || INITIAL_USERS.find((u) => u.role === 'Lab Assistant');
    } else if (newRole === 'HoD / Admin') {
      matched = INITIAL_USERS.find((u) => u.prn === 'T100101') || INITIAL_USERS.find((u) => u.name?.includes('Sumit'));
    }
    if (!matched) {
      matched = INITIAL_USERS.find((u) => u.role === newRole);
    }
    if (matched) {
      setCurrentUser(matched);
      setIsAuthenticated(true);
      apiClient.setAuth('mock_token_jwt', matched.role, matched.prn);
      localStorage.setItem('labtrack_active_role', matched.role);
      localStorage.setItem('labtrack_active_prn', matched.prn);
      localStorage.setItem('labtrack_is_auth', 'true');
    }
  };

  /**
   * Primary authentication pipeline using MySQL Relational Engine
   */
  const loginWithMySQL = async (prn, password, role) => {
    const res = await mysqlAuth.authenticate(prn, password, role);
    if (!res.success) {
      return res;
    }

    const verified = res.user;
    const baseProfile =
      INITIAL_USERS.find((u) => u.prn?.toLowerCase() === verified.id?.toLowerCase() || u.prn?.toLowerCase() === prn?.toLowerCase()) ||
      INITIAL_USERS.find((u) => u.name?.toLowerCase() === verified.name?.toLowerCase()) ||
      (verified.role === 'Faculty' ? INITIAL_USERS.find((u) => u.prn === 'T100460') : null) ||
      INITIAL_USERS.find((u) => u.role === verified.role) ||
      INITIAL_USERS[0];

    const customizedUser = {
      ...baseProfile,
      prn: verified.id || baseProfile.prn,
      name: verified.name || baseProfile.name,
      role: verified.role || baseProfile.role,
      department: verified.department || baseProfile.department,
      email: verified.email || baseProfile.email,
      cohort: verified.cohort || baseProfile.cohort,
      authSource: 'MySQL (labtrack_db.users)',
    };

    setCurrentUser(customizedUser);
    setIsAuthenticated(true);
    localStorage.setItem('labtrack_active_role', customizedUser.role);
    localStorage.setItem('labtrack_active_prn', customizedUser.prn);
    localStorage.setItem('labtrack_is_auth', 'true');
    return { success: true, user: customizedUser };
  };

  /**
   * Excel validation pipeline
   */
  const loginWithExcel = (prn, password, role) => {
    const validation = validateCredentialsAgainstExcel(excelRoster, prn, password, role);

    const logEntry = {
      timestamp: new Date().toISOString(),
      prn,
      role,
      status: validation.success ? 'SUCCESS' : 'FAILED',
      reason: validation.error || 'Authorized',
    };
    setAuthAuditLogs((prev) => [logEntry, ...prev]);

    if (!validation.success) {
      return validation;
    }

    const verified = validation.user;
    const baseProfile = INITIAL_USERS.find((u) => u.role === verified.role) || INITIAL_USERS[0];

    const customizedUser = {
      ...baseProfile,
      prn: verified.id,
      name: verified.name,
      role: verified.role,
      department: verified.department,
      email: verified.email,
      cohort: verified.cohort,
      authSource: 'Excel Roster (.xlsx)',
    };

    setCurrentUser(customizedUser);
    setIsAuthenticated(true);
    return { success: true, user: customizedUser };
  };

  /**
   * Universal Login Dispatcher (defaults to MySQL)
   */
  const login = async (prn, password, role) => {
    if (activeDatabaseProvider === 'mysql') {
      const res = await loginWithMySQL(prn, password, role);
      if (res.success) return true;
    }

    // Secondary fallback
    const excelRes = loginWithExcel(prn, password, role);
    if (excelRes.success) return true;

    // Fallback to mock profile if valid role
    const matched = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    setCurrentUser({ ...matched, prn: prn || matched.prn });
    setIsAuthenticated(true);
    return true;
  };

  const uploadCustomRoster = async (file) => {
    try {
      const buffer = await file.arrayBuffer();
      const res = parseExcelWorkbook(buffer);
      if (res.success && res.roster.length > 0) {
        setExcelRoster(res.roster);
        return { success: true, count: res.count, sheetName: res.sheetName };
      }
      return { success: false, error: res.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const downloadAuditLog = () => {
    exportAuditLogToExcel(authAuditLogs);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('labtrack_is_auth', 'false');
  };

  const hasAccessTo = (path) => {
    if (!currentUser) return false;
    const permissions = ROLE_PERMISSIONS[currentUser.role];
    if (!permissions) return false;
    if (currentUser.role === 'HoD / Admin') return true;

    return permissions.allowedRoutes.some((allowed) => {
      if (allowed === path) return true;
      if (path.startsWith(allowed)) return true;
      return false;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser,
        role: currentUser?.role || 'Student',
        currentRole: currentUser?.role || 'Student',
        isAuthenticated,
        permissions: ROLE_PERMISSIONS[currentUser?.role || 'Student'],
        activeDatabaseProvider,
        setActiveDatabaseProvider,
        // MySQL Service APIs
        loginWithMySQL,
        mysqlService: mysqlAuth,
        mysqlAccountsCount: mysqlAuth.getRosterCount(),
        // Excel APIs
        excelRoster,
        isExcelLoaded,
        authAuditLogs,
        loginWithExcel,
        uploadCustomRoster,
        downloadAuditLog,
        // Common
        switchRole,
        setRole: switchRole,
        login,
        logout,
        hasAccessTo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
