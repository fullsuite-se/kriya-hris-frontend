import suiteliferAPI from "@/config/suiteliferAPI";

export const registerSuiteliferAPI = async (userId, workEmail, password, firstName, middleName, lastName, recaptchaToken, isVerified, isActive) => {
    try {


        const response = await suiteliferAPI.post("/api/register", {
            userId,
            workEmail,
            password,
            firstName,
            middleName,
            lastName,
            recaptchaToken,
            isVerified,
            isActive,
        });

        return response;
    } catch (error) {
        console.error("Error adding employee to suitelifer:", error);
        throw error.response?.data || error;
    }
};