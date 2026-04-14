import { createContext, useContext, useMemo, useState } from 'react';

const EMPLOYEE_TOKEN_KEY = 'employee_token';
const EmployeeContext = createContext();

const defaultUser = {
  name: 'Dr. Alex Morgan',
  email: 'doctor@example.com',
  plan: 'Free',
};

export const EmployeeProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem(EMPLOYEE_TOKEN_KEY));
  const [user, setUser] = useState(defaultUser);

  const setEmployeeSession = (nextToken, nextUser = defaultUser) => {
    setToken(nextToken);
    setUser(nextUser);
    if (nextToken) {
      sessionStorage.setItem(EMPLOYEE_TOKEN_KEY, nextToken);
    } else {
      sessionStorage.removeItem(EMPLOYEE_TOKEN_KEY);
    }
  };

  const logoutEmployee = () => {
    setEmployeeSession(null, defaultUser);
  };

  const value = useMemo(() => ({
    employeeAuth: {
      isAuthenticated: Boolean(token),
      token,
    },
    employeeUser: user,
    setEmployeeSession,
    logoutEmployee,
  }), [token, user]);

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
};

export const useEmployee = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployee must be used within EmployeeProvider');
  }
  return context;
};
