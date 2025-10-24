import { checkEmailAvailabilitySuiteliferAPI, checkIdAvailabilitySuiteliferAPI } from "@/services/suitelifer/userSuiteliferAPI";
import { useMutation } from "@tanstack/react-query";

export const useCheckIdAvailabilitySuiteliferAPI = () => {
    const { mutateAsync, data, isPending, error } = useMutation({
        mutationFn: checkIdAvailabilitySuiteliferAPI,
    });

    const checkIdAvailabilitySuitelifer = async (user_id) => {
        if (!user_id) return null;
        return await mutateAsync(user_id);
    };
    return {
        isIdAvailableSuitelifer: data ?? null,
        isIdAvailableSuiteliferLoading: isPending,
        checkIdAvailabilitySuitelifer,
        error,
    };
};



export const useCheckEmailAvailabilitySuiteliferAPI = () => {
    const { mutateAsync, data, isPending, error } = useMutation({
        mutationFn: checkEmailAvailabilitySuiteliferAPI,
    });

    const checkEmailAvailabilitySuitelifer = async (user_email) => {
        if (!user_email) return null;
        return await mutateAsync(user_email);
    };
    return {
        isEmailAvailableSuitelifer: data ?? null,
        isEmailAvailableSuiteliferLoading: isPending,
        checkEmailAvailabilitySuitelifer,
        error,
    };
};
