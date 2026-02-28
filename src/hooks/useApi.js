import { useState, useCallback } from 'react';
import { apiService } from '../services/Api';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (apiCall) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiCall();
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Something went wrong';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, request };
};
