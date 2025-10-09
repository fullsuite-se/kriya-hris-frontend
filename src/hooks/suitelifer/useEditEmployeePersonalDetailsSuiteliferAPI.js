import fetchEmployeeDetailsAPI from "@/services/employeeAPI";
import { editEmployeePersonalDetailsSuiteliferAPI } from "@/services/suitelifer/editEmployeePersonalDetailsSuiteliferAPI";
import { useState } from "react";

export const useEditEmployeePersonalDetailsSuiteliferAPI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const editEmployeePersonalDetailsSuitelifer = async (user_id, updatedData) => {
        setLoading(true);
        setError(null);

        try {
            // Update employee record
            const updatedUserInfo = await editEmployeePersonalDetailsSuiteliferAPI(
                user_id,
                updatedData
            );
            await fetchEmployeeDetailsAPI({ user_id });

            console.log(
                "Employee Personal Details updated successfully -sl:",
                updatedUserInfo
            );
            return updatedUserInfo;
        } catch (err) {
            console.error("Failed to update Employee Personal Details -sl:", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { editEmployeePersonalDetailsSuitelifer, loading, error };
};
