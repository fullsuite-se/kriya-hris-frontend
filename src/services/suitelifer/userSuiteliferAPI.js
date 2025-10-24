import suiteliferAPI from "@/config/suiteliferAPI";


export const checkIdAvailabilitySuiteliferAPI = async (user_id) => {
    try {
        const response = await suiteliferAPI.get(`/api/users/is-id-available/${user_id}`);
        return response.data?.available;
    } catch (error) {
        throw error.response?.data || error;
    }
};



export const checkEmailAvailabilitySuiteliferAPI = async (user_email) => {
    try {
        const response = await suiteliferAPI.get(`/api/users/is-email-available/${user_email}`);
        return response.data?.available;
    } catch (error) {
        throw error.response?.data || error;
    }
};
