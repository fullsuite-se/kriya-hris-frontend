import { activateSuiteliferAPI } from "@/services/suitelifer/activateSuiteliferAPI";
import { useState } from "react";

export const useActivateSuiteliferAPI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const activateSuitelifer = async (isActive, accountId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await activateSuiteliferAPI(isActive, accountId);
            return result;
        } catch (err) {
            console.error("Failed to deactivate employee in Suitelifer:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { activateSuitelifer, loading, error };
};
