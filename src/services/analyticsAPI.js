import api from "@/config/api";

export const fetchAvailableYearsAPI = async () => {
    try {
        const response = await api.get(`/api/analytics/available-years`);
        console.log("Available years fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch available years:", error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to fetch available years'
        };
    }
};

export const fetchMonthlyTrendsAPI = async (params) => {
    try {
        const response = await api.get(`/api/analytics/monthly-trends`, { params });
        console.log("Monthly trends fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch monthly trends:", error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to fetch monthly trends'
        };
    }
};