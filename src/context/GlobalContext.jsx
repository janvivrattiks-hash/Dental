import { createContext, useContext, useState, useMemo } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState({ name: 'Dr. Jane Smith', role: 'Main Dentist' });
    const [auth, setAuth] = useState({ isAuthenticated: false, token: null });
    const [dashboardStats, setDashboardStats] = useState({
        totalPatients: 1250,
        appointmentsToday: 18,
        revenue: '$4,250',
        newInquiries: 5,
    });

    const value = useMemo(() => ({
        user, setUser,
        auth, setAuth,
        dashboardStats, setDashboardStats
    }), [user, auth, dashboardStats]);

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
};
