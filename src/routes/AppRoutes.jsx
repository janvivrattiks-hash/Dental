import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useGlobal } from '../context/GlobalContext';

// Lazy load pages
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Patients = lazy(() => import('../pages/Patients'));
const Appointments = lazy(() => import('../pages/Appointments'));
const Settings = lazy(() => import('../pages/Settings'));

const LoadingFallback = () => (
    <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clinical-blue"></div>
    </div>
);

const AppRoutes = () => {
    const { auth } = useGlobal();

    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Public Routes */}
                {!auth.isAuthenticated ? (
                    <>
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </>
                ) : (
                    /* Protected Routes */
                    <>
                        <Route path="/" element={<DashboardLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="patients" element={<Patients />} />
                            <Route path="appointments" element={<Appointments />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>
                        <Route path="/login" element={<Navigate to="/" replace />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </>
                )}
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
