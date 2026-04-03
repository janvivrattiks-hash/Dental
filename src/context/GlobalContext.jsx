import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const GlobalContext = createContext();

const getStoredAuth = () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        return {
            auth: { isAuthenticated: false, token: null },
            user: { name: 'Dr. Jane Smith', role: 'Main Dentist' },
        };
    }

    return {
        auth: { isAuthenticated: true, token },
        user: { name: 'Admin User', role: 'System Administrator' },
    };
};

export const GlobalProvider = ({ children }) => {
    const storedState = getStoredAuth();
    const [user, setUser] = useState(storedState.user);
    const [auth, setAuth] = useState(storedState.auth);
    const [dashboardStats, setDashboardStats] = useState({
        totalPatients: 1250,
        appointmentsToday: 18,
        revenue: '$4,250',
        newInquiries: 5,
    });

    useEffect(() => {
        if (auth.token) {
            sessionStorage.setItem('token', auth.token);
        } else {
            sessionStorage.removeItem('token');
        }
    }, [auth.token]);

    useEffect(() => {
        // Never persist user profile data in browser storage.
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
    }, []);

    const logout = () => {
        setAuth({ isAuthenticated: false, token: null });
        setUser({ name: 'Dr. Jane Smith', role: 'Main Dentist' });
        sessionStorage.removeItem('user');
        localStorage.removeItem('user');
    };

    const value = useMemo(() => ({
        user, setUser,
        auth, setAuth,
        dashboardStats, setDashboardStats,
        logout,
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
