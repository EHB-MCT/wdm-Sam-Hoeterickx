import { useState } from "react";

//Service
import { authService } from "../../services";

export const useRegisterUser = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(undefined);
    const [error, setError] = useState(false);

    const register = async (username, email, password, repeatPassword, onSuccess) => {
        setIsLoading(true);
        setIsSuccess(undefined);
        setError(false);

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