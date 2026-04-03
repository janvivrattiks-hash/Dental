import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { GlobalProvider, useGlobal } from './context/GlobalContext';
import DashboardLayout from './components/layout/DashboardLayout';
import { ToastContainer } from 'react-toastify';
import { ContextProviderClass } from './ContextProvider';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ToleranceConfig = lazy(() => import('./pages/ToleranceConfig'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const Billing = lazy(() => import('./pages/Billing'));
const UpdateLibrary = lazy(() => import('./pages/UpdateLibrary'));
const SubscriptionPlans = lazy(() => import('./pages/SubscriptionPlans'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clinical-blue"></div>
  </div>
);

const AppRouter = () => {
  const { auth } = useGlobal();

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {!auth.isAuthenticated ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="library" element={<Dashboard />} />
              <Route path="library/edit" element={<UpdateLibrary />} />
              <Route path="payments" element={<Billing />} />
              <Route path="plans" element={<SubscriptionPlans />} />
              <Route path="settings" element={<AccountSettings />} />
              <Route path="settings/tolerance" element={<ToleranceConfig />} />
            </Route>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <Router>
      <GlobalProvider>
        <ContextProviderClass>
          <AppRouter />
          <ToastContainer position="bottom-right" autoClose={2500} />
        </ContextProviderClass>
      </GlobalProvider>
    </Router>
  );
}

export default App;
