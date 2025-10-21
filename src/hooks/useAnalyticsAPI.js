import { fetchMonthlyTrendsAPI, fetchAvailableYearsAPI } from '@/services/analyticsAPI';
import { useState, useEffect } from 'react';

export const useFetchMonthlyTrendsAPI = (year = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMonthlyTrends = async () => {
            try {
                setLoading(true);
                setError(null);

                const params = new URLSearchParams();
                if (year) params.append('year', year);

                const result = await fetchMonthlyTrendsAPI(params);

                if (!result) {
                    throw new Error('No response received from server');
                }

                if (result.success) {
                    setData(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch monthly trends');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching monthly trends:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMonthlyTrends();
    }, [year]);

    return { data, loading, error };
};

export const useFetchAvailableYearsAPI = () => {
    const [years, setYears] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAvailableYears = async () => {
            try {
                setLoading(true);
                setError(null);

                const result = await fetchAvailableYearsAPI();

                if (!result) {
                    throw new Error('No response received from server');
                }

                if (result.success) {
                    setYears(result.data);
                } else {
                    throw new Error(result.message || 'Failed to fetch available years');
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching available years:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableYears();
    }, []);

    return { years, loading, error };
};