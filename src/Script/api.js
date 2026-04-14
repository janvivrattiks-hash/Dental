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
        list: async () => apiService.get('/admin/all_libraries'),
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
};

export default api;