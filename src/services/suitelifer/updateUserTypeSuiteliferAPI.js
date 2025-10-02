import suiteliferAPI from "@/config/suiteliferAPI";

export const updateUserTypeSuiteliferAPI = async (userType, accountId) => {
    try {
        const response = await suiteliferAPI.patch("/api/users/type", {
            userType,
            accountId,
        });
        return response;
    } catch (error) {
        console.error("Error changing user type in suitelifer:", error);
        throw error.response?.data || error;
    }
};