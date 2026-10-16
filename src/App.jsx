import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { LabDataProvider } from './context/LabDataContext';
import { Shell } from './components/layout/Shell';
import { RoleGuard } from './components/common/RoleGuard';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Inventory Pages
import { InventoryListPage } from './pages/inventory/InventoryListPage';
import { AssetDetailPage } from './pages/inventory/AssetDetailPage';

// Custody Pages
import { ActiveLoansPage } from './pages/custody/ActiveLoansPage';
import { RequisitionsPage } from './pages/custody/RequisitionsPage';
import { ReservationsPage } from './pages/custody/ReservationsPage';

// Accountability Pages
import { ReliabilityReportPage } from './pages/accountability/ReliabilityReportPage';
import { AuditLogPage } from './pages/accountability/AuditLogPage';

// Project Pages
import { ProjectDirectoryPage } from './pages/projects/ProjectDirectoryPage';
import { ProjectDetailPage } from './pages/projects/ProjectDetailPage';

// Operations Pages
import { ApprovalsQueuePage } from './pages/operations/ApprovalsQueuePage';
import { DispatchDeskPage } from './pages/operations/DispatchDeskPage';
import { DefectManagementPage } from './pages/operations/DefectManagementPage';


export function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <LabDataProvider>
            <Routes>
              {/* FIRST: The Login Page with Student, Faculty, Lab Assistant, and Admin */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

              {/* Hero routes redirect directly to workspace */}
              <Route path="/hero" element={<Navigate to="/workspace" replace />} />
              <Route path="/experience" element={<Navigate to="/workspace" replace />} />

              {/* Authenticated Workspace Shell */}
              <Route path="/workspace" element={<Shell />}>
                <Route index element={<Navigate to="inventory" replace />} />

                {/* Inventory Registry */}
                <Route path="inventory" element={<InventoryListPage />} />
                <Route
                  path="inventory/assets"
                  element={<InventoryListPage initialClassification="Asset" />}
                />
                <Route
                  path="inventory/components"
                  element={<InventoryListPage initialClassification="Consumable" />}
                />
                <Route
                  path="inventory/consumables"
                  element={<InventoryListPage initialClassification="Consumable" />}
                />
                <Route path="inventory/:itemId" element={<AssetDetailPage />} />

                {/* Requisitions & Circulation */}
                <Route path="custody">
                  <Route index element={<Navigate to="active" replace />} />
                  <Route path="active" element={<ActiveLoansPage />} />
                  <Route path="requests" element={<RequisitionsPage />} />
                  <Route path="reservations" element={<ReservationsPage />} />
                </Route>

                {/* Accountability & Reliability */}
                <Route path="accountability">
                  <Route index element={<Navigate to="reliability" replace />} />
                  <Route path="reliability" element={<ReliabilityReportPage />} />
                  <Route
                    path="audit-log"
                    element={
                      <RoleGuard allowedRoles={['Lab Assistant', 'HoD / Admin']}>
                        <AuditLogPage />
                      </RoleGuard>
                    }
                  />
                </Route>

                {/* Academic Projects */}
                <Route path="projects">
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<ProjectDirectoryPage />} />
                  <Route path=":projectId" element={<ProjectDetailPage />} />
                </Route>

                {/* Staff & Faculty Operations (Enforced with RoleGuard) */}
                <Route path="operations">
                  <Route index element={<Navigate to="approvals" replace />} />
                  <Route
                    path="approvals"
                    element={
                      <RoleGuard allowedRoles={['Faculty', 'HoD / Admin']}>
                        <ApprovalsQueuePage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="dispatch"
                    element={
                      <RoleGuard allowedRoles={['Lab Assistant', 'HoD / Admin']}>
                        <DispatchDeskPage />
                      </RoleGuard>
                    }
                  />
                  <Route
                    path="defects"
                    element={
                      <RoleGuard allowedRoles={['Faculty', 'Lab Assistant', 'HoD / Admin']}>
                        <DefectManagementPage />
                      </RoleGuard>
                    }
                  />
                </Route>

                {/* 404 Fallback */}
                <Route path="*" element={<Navigate to="/workspace/inventory" replace />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/workspace/inventory" replace />} />
            </Routes>
          </LabDataProvider>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
