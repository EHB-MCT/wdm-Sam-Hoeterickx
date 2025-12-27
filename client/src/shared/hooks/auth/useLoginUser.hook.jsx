import { useState } from "react";

//Service
import { authService } from "../../services";

/**
 * Custom hook that handles the user login process.
 * Manages loading, success, and error states for the authentication request.
 * 
 * @returns {Object} - The login management object
 * @property {Function} login - Function to trigger the login request (params: email, password, onSuccess)
 * @property {boolean} isLoading - True while the login request is being processed
 * @property {boolean|undefined} isSuccess - True if login was successful, false if failed, undefined if not attempted
 * @property {Object|boolean} error - The error object ({status, message}) if failed, otherwise false
*/

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