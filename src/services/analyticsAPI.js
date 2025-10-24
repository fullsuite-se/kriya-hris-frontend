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


export const fetchAttritionRateAPI = async (params) => {
    try {
        const response = await api.get(`/api/analytics/attrition-rate`, { params });
        console.log("Attrition rate fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch Attrition rate:", error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to fetch Attrition rate'
        };
    }
};



export const fetchSexDistributionAPI = async () => {
    try {
        const response = await api.get(`/api/analytics/sex-distribution`);
        console.log("Sex distribution fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch Sex distribution:", error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to fetch Sex distribution'
        };
    }
};
export const fetchAgeDistributionAPI = async () => {
    try {
        const response = await api.get(`/api/analytics/age-distribution`);
        console.log("Age distribution fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch Age distribution:", error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to fetch Age distribution'
        };
    }
};

export const fetchTenureDistributionAPI = async () => {
    try {
        const response = await api.get(`/api/analytics/tenure-distribution`);
        console.log("Tenure distribution fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch Tenure distribution:", error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'Failed to fetch Tenure distribution'
        };
    }
};
