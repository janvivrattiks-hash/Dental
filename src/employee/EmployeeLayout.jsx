import { Navigate, Outlet, useLocation } from 'react-router-dom';
import EmployeeSidebar from './components/EmployeeSidebar';
import EmployeeTopbar from './components/EmployeeTopbar';
import WorkflowHelpFab from './components/WorkflowHelpFab';
import { useEmployee } from '../context/EmployeeContext';

const titleByPath = {
  '/dashboard': 'Dashboard',
  '/new-case': 'New Case',
  '/my-cases': 'My Cases',
  '/library': 'Library',
  '/subscription': 'Subscription & Billing',
  '/settings': 'Settings',
};

const EmployeeLayout = () => {
  const { employeeAuth } = useEmployee();
  const { pathname } = useLocation();

  if (!employeeAuth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="employee-shell flex w-full overflow-x-hidden">
      <EmployeeSidebar />
      <div className="flex-1 min-h-screen min-w-0 lg:pl-[240px]">
        <EmployeeTopbar title={titleByPath[pathname] || 'MyPathFinder'} />
        <main className="p-3 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <WorkflowHelpFab />
    </div>
  );
};

export default EmployeeLayout;
