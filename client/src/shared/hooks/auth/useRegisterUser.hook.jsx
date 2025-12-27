import { useState } from "react";

//Service
import { authService } from "../../services";

/**
 * Custom hook that handles new user registration.
 * 
 * @returns {Object} - The registration management object
 * @property {Function} register - Function to trigger registration (params: username, email, password, repeatPassword, onSuccess)
 * @property {boolean} isLoading - True while the registration is being processed
 * @property {boolean|undefined} isSuccess - True if registration was successful, false if failed
 * @property {Object|boolean} error - The error object ({status, message}) if failed, otherwise false
*/

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