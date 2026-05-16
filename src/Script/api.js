import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL =
    import.meta.env.VITE_ENV === 'PROD'
        ? import.meta.env.VITE_BASE_URL_PRODUCTION
        : import.meta.env.VITE_BASE_URL_DEVELOPMENT;

const FALLBACK_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const RESOLVED_BASE_URL = API_BASE_URL || FALLBACK_BASE_URL;

const apiClient = axios.create({
    baseURL: RESOLVED_BASE_URL,
});

export const notifyError = (text, backgroundColor = '#FEE2E2', color = '#B91C1C') => toast.error(text, {
    position: 'bottom-right',
    style: {
        backgroundColor,
        color,
    },
});

export const notifySuccess = (text, backgroundColor = '#DCFCE7', color = '#166534') => toast.success(text, {
    position: 'bottom-right',
    style: {
        backgroundColor,
        color,
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            notifyError('Session expired. Please login again.');
        }
        return Promise.reject(error);
    }
);

const buildFormData = (payload) => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            formData.append(key, value);
        }
    });

    return formData;
};

export const apiService = {
    get: (url, params, config = {}) => apiClient.get(url, { ...config, params }),
    post: (url, data, config = {}) => apiClient.post(url, data, config),
    put: (url, data, config = {}) => apiClient.put(url, data, config),
    patch: (url, data, config = {}) => apiClient.patch(url, data, config),
    delete: (url, config = {}) => apiClient.delete(url, config),
    postForm: (url, data, config = {}) => {
        const form = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                form.append(key, value);
            }
        });

        return apiClient.post(url, form, {
            ...config,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...(config.headers || {}),
            },
        });
    },
    postMultipart: (url, payload, config = {}) => {
        const formData = payload instanceof FormData ? payload : buildFormData(payload);
        return apiClient.post(url, formData, config);
    },
    putMultipart: (url, payload, config = {}) => {
        const formData = payload instanceof FormData ? payload : buildFormData(payload);
        return apiClient.put(url, formData, config);
    },
};

const EMPLOYEE_TOKEN_KEY = 'employee_token';

const employeeClient = axios.create({
    baseURL: RESOLVED_BASE_URL,
});

employeeClient.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem(EMPLOYEE_TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

employeeClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            notifyError('Session expired. Please login again.');
        }
        return Promise.reject(error);
    }
);

export const employeeService = {
    get: (url, params, config = {}) => employeeClient.get(url, { ...config, params }),
    post: (url, data, config = {}) => employeeClient.post(url, data, config),
    put: (url, data, config = {}) => employeeClient.put(url, data, config),
    patch: (url, data, config = {}) => employeeClient.patch(url, data, config),
    delete: (url, config = {}) => employeeClient.delete(url, config),
    postMultipart: (url, payload, config = {}) => {
        const formData = payload instanceof FormData ? payload : buildFormData(payload);
        return employeeClient.post(url, formData, config);
    },
};

const api = {
    auth: {
        login: async (email, password) => apiService.postForm('/admin/auth/login', {
            username: email,
            password,
        }),
        signup: async (payload) => apiService.post('/admin/auth/signup', payload),
    },

    admin: {
        getCurrentAdmin: async (token) => apiService.get('/admin/auth/current_admin', undefined, token ? {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        } : {}),
        updateCurrentAdmin: async (payload, token) => apiService.put('/admin/auth/update', payload, token ? {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        } : {}),
    },

    libraries: {
        list: async () => apiService.get('/admin/libraries'),
        create: async (payload) => apiService.postMultipart('/admin/libraries', payload),
        uploadAsset: async (libraryId, payload) => apiService.postMultipart(`/admin/libraries/${libraryId}/assets`, payload),
    },

    all_libraries: {
        // params: { page, size, search, company_name }
        list: async (params) => employeeService.get('/admin/all_libraries', params),
        // company_name required; angle_alignment optional — when provided returns only matching libraries
        listByCompany: async (companyName, angleAlignment = null) =>
            employeeService.get('/admin/libraries_by_company', {
                company_name: companyName,
                ...(angleAlignment !== null ? { angle_alignment: angleAlignment } : {}),
            }),
        // Distinct angle_alignment values for a brand (with library count per angle)
        anglesByBrand: async (companyName) =>
            employeeService.get('/admin/angles_by_brand', { company_name: companyName }),
        getById: async (libraryId) => employeeService.get(`/admin/library/${libraryId}`),
        listByAngle: async (angleAlignment) => employeeService.get('/admin/libraries_by_angle', { angle_alignment: angleAlignment }),
        brands: async () => employeeService.get('/admin/brands'),
    },

    plans: {
        list: async (params) => apiService.get('/plans', params),
        get: async (planId) => apiService.get(`/plans/${planId}`),
        create: async (payload) => apiService.post('/plans', payload),
        update: async (planId, payload) => apiService.patch(`/plans/${planId}`, payload),
        remove: async (planId) => apiService.delete(`/plans/${planId}`),
    },

    subscriptions: {
        list: async (params) => apiService.get('/subscriptions', params),
        get: async (subscriptionId) => apiService.get(`/subscriptions/${subscriptionId}`),
        create: async (payload) => apiService.post('/subscriptions', payload),
        update: async (subscriptionId, payload) => apiService.patch(`/subscriptions/${subscriptionId}`, payload),
        remove: async (subscriptionId) => apiService.delete(`/subscriptions/${subscriptionId}`),
    },

    // ── Employee / User Panel ─────────────────────────────────────────────────
    employee: {
        auth: {
            register: async (payload) => employeeService.post('/user/auth/register', payload),
            login: async (payload) => employeeService.post('/user/auth/login', payload),
            logout: async () => employeeService.post('/user/auth/logout'),
            me: async () => employeeService.get('/user/auth/me'),
        },
        profile: {
            get: async () => employeeService.get('/user/profile'),
            update: async (payload) => employeeService.put('/user/profile', payload),
            changePassword: async (payload) => employeeService.put('/user/profile/change-password', payload),
        },
        cases: {
            list: async (params) => employeeService.get('/user/cases', params),
            create: async (payload) => employeeService.post('/user/cases', payload),
            get: async (caseId) => employeeService.get(`/user/cases/${caseId}`),
            update: async (caseId, payload) => employeeService.put(`/user/cases/${caseId}`, payload),
            remove: async (caseId) => employeeService.delete(`/user/cases/${caseId}`),
            getTeeth: async (caseId) => employeeService.get(`/user/cases/${caseId}/teeth`),
            addTeeth: async (caseId, teeth) => employeeService.post(`/user/cases/${caseId}/teeth`, teeth),
            updateTooth: async (caseId, toothId, payload) => employeeService.put(`/user/cases/${caseId}/teeth/${toothId}`, payload),
            uploadScan: async (caseId, file) => {
                const form = new FormData();
                form.append('file', file);
                return employeeService.post(`/user/cases/${caseId}/upload-scan`, form);
            },
            updateStep: async (caseId, step) =>
                employeeService.patch(`/user/cases/${caseId}/step`, { current_step: step }),
        },
        analysis: {
            calculate: async (caseId) => employeeService.post(`/user/analysis/calculate/${caseId}`),
            results: async (caseId) => employeeService.get(`/user/analysis/${caseId}/results`),
        },
        subscription: {
            myPlan: async () => employeeService.get('/user/subscription/my-plan'),
            plans: async () => employeeService.get('/user/subscription/plans'),
            usage: async () => employeeService.get('/user/subscription/usage'),
        },
    },
};

export default api;