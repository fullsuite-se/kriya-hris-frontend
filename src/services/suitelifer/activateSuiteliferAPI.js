import suiteliferAPI from "@/config/suiteliferAPI";

export const activateSuiteliferAPI = async (isActive, accountId) => {
    try {
        const response = await suiteliferAPI.patch("/api/users/status", {
            isActive,
            accountId,
        });
        return response;
    } catch (error) {
        console.error("Error deactivating user to suitelifer:", error);
        throw error.response?.data || error;
    }
};