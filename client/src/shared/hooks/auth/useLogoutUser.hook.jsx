import { useState } from "react";

//Service
import { authService } from "../../services";

export const useLogoutUser = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(undefined);
    const [error, setError] = useState({
        status: undefined,
        message: undefined
    });

    const logout = async (onSuccess) => {
        setIsLoading(true);
        setIsSuccess(undefined);
        setError({ 
            status: undefined, 
            message: undefined 
        });

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