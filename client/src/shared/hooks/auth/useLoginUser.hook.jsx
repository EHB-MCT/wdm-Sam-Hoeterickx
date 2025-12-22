import { useState } from "react";

//Service
import { authService } from "../../services";

export const useLoginUser = () => {
 
    const [isSuccess, setIsSuccess] = useState(undefined);
    const [error, setError] = useState({
        status: undefined,
        message: undefined
    })

    const login = async(email, password, onSuccess) => {
        setIsLoading(true);
        setIsSuccess(undefined);
        setError({ status: undefined, message: undefined });

        try{
            const data = await authService.loginUser(email, password);

            setIsSuccess(true);
            if(onSuccess) onSuccess(data);

        }catch (error) {
            setIsSuccess(false);
            setError({
                status: 'Error', 
                message: error.message
            });
        } finally {
            setIsLoading(false);
        }
    }

    return { login, isLoading, isSuccess, error };
    
}