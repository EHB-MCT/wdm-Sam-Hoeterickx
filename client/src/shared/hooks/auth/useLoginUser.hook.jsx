import { useState } from "react";

//Service
import { authService } from "../../services";

export const useLoginUser = () => {
 
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(undefined);
    const [error, setError] = useState(false);

    const login = async(email, password, onSuccess) => {
        setIsLoading(true);
        setIsSuccess(undefined);
        setError(false);

        try{
            await authService.loginUser(email, password);

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
    }

    return { login, isLoading, isSuccess, error };
    
}