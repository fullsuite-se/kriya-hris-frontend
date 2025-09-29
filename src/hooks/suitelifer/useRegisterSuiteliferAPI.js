import { registerSuiteliferAPI } from "@/services/suitelifer/registerSuiteliferAPI";
import { useState } from "react";

export const useRegisterSuiteliferAPI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const registerSuitelifer = async ({userId, workEmail, password, firstName, middleName, lastName, recaptchaToken, isVerified, isActive}) => {
        setLoading(true);
        setError(null);
        try {
            const result = await registerSuiteliferAPI(userId, workEmail, password, firstName, middleName, lastName, recaptchaToken, isVerified, isActive);




            return result;
        } catch (err) {
            console.error("Failed to add employee in Suitelifer:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { registerSuitelifer, loading, error };
};
