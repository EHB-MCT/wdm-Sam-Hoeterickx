import { useState } from "react";

//Service
import { authService } from "../../services";

export const useRegisterUser = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(undefined);
    const [error, setError] = useState({
        status: undefined,
        message: undefined
    });

    const register = async (username, email, password, repeatPassword, onSuccess) => {
        setIsLoading(true);
        setIsSuccess(undefined);
        setError({ status: undefined, message: undefined });

        try {
            await authService.registerUser(username, email, password, repeatPassword);

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

    return { register, isLoading, isSuccess, error };
};