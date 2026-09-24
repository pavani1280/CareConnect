import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AIRequestPage from './pages/customer/AIRequestPage';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerRequestsPage from './pages/customer/CustomerRequestsPage';
import JobTrackingPage from './pages/customer/JobTrackingPage';
import InvoicePage from './pages/customer/InvoicePage';

// Provider Pages
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderRequestsPage from './pages/provider/ProviderRequestsPage';
import ProviderCalendarPage from './pages/provider/ProviderCalendarPage';
import ProviderDocumentsPage from './pages/provider/ProviderDocumentsPage';

// Ops Pages
import OperationsDashboard from './pages/ops/OperationsDashboard';

// Support Pages
import SupportDashboard from './pages/support/SupportDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProviderVerificationPage from './pages/admin/ProviderVerificationPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';

// Protection Guard
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/services" element={<LandingPage />} />
      <Route path="/how-it-works" element={<LandingPage />} />
      <Route path="/become-provider" element={<RegisterPage />} />
      <Route path="/about" element={<LandingPage />} />
      <Route path="/ai-request" element={<AIRequestPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Customer Routes */}
      <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/requests" element={<CustomerRequestsPage />} />
        <Route path="/customer/bookings" element={<CustomerDashboard />} />
        <Route path="/customer/track/:id" element={<JobTrackingPage />} />
        <Route path="/customer/invoice/:id" element={<InvoicePage />} />
        <Route path="/customer/invoices" element={<CustomerDashboard />} />
        <Route path="/customer/reviews" element={<CustomerDashboard />} />
        <Route path="/customer/notifications" element={<CustomerDashboard />} />
        <Route path="/customer/support" element={<SupportDashboard />} />
      </Route>

      {/* Protected Provider Routes */}
      <Route element={<ProtectedRoute allowedRoles={['PROVIDER']} />}>
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        <Route path="/provider/requests" element={<ProviderRequestsPage />} />
        <Route path="/provider/jobs" element={<ProviderDashboard />} />
        <Route path="/provider/calendar" element={<ProviderCalendarPage />} />
        <Route path="/provider/earnings" element={<ProviderDashboard />} />
        <Route path="/provider/reviews" element={<ProviderDashboard />} />
        <Route path="/provider/documents" element={<ProviderDocumentsPage />} />
        <Route path="/provider/profile" element={<ProviderDashboard />} />
      </Route>

      {/* Protected Operations Manager Routes */}
      <Route element={<ProtectedRoute allowedRoles={['OPERATIONS_MANAGER', 'ADMIN']} />}>
        <Route path="/ops/dashboard" element={<OperationsDashboard />} />
        <Route path="/ops/bookings" element={<OperationsDashboard />} />
        <Route path="/ops/assignments" element={<OperationsDashboard />} />
        <Route path="/ops/escalations" element={<OperationsDashboard />} />
        <Route path="/ops/analytics" element={<OperationsDashboard />} />
      </Route>

      {/* Protected Support Agent Routes */}
      <Route element={<ProtectedRoute allowedRoles={['SUPPORT_AGENT', 'ADMIN']} />}>
        <Route path="/support/dashboard" element={<SupportDashboard />} />
        <Route path="/support/tickets" element={<SupportDashboard />} />
        <Route path="/support/disputes" element={<SupportDashboard />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/verification" element={<ProviderVerificationPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/services" element={<AdminServicesPage />} />
        <Route path="/admin/disputes" element={<SupportDashboard />} />
        <Route path="/admin/audit-logs" element={<AdminDashboard />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
