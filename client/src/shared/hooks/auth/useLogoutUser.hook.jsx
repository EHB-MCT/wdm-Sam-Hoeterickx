import { useState } from "react";

//Service
import { authService } from "../../services";

export const useLogoutUser = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(undefined);
    const [error, setError] = useState(false)

    const logout = async (onSuccess) => {
        setIsLoading(true);
        setIsSuccess(undefined);
        setError(false);

        try {
            await authService.logoutUser();

            setIsSuccess(true);
            if(onSuccess) onSuccess();

        }catch (error) {
            setIsSuccess(false);
            setError({ 
                status: error.status,
                message: error.message 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return { logout, isLoading, isSuccess, error };
};