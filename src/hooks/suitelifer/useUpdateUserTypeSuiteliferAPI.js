import { updateUserTypeSuiteliferAPI } from "@/services/suitelifer/updateUserTypeSuiteliferAPI";
import { useState } from "react";

export const useUpdateUserTypeSuiteliferAPI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateUserTypeSuitelifer = async (userType, accountId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await updateUserTypeSuiteliferAPI(userType, accountId);
            return result;
        } catch (err) {
            console.error("Failed to update user type in Suitelifer:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { updateUserTypeSuitelifer, loading, error };
};
