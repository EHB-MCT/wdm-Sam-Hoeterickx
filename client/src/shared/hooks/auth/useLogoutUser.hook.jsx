import { useState } from "react";

//Service
import { authService } from "../../services";

/**
 * Custom hook that handles the user logout process.
 * 
 * @returns {Object} - The logout management object
 * @property {Function} logout - Function to trigger the logout request (params: onSuccess)
 * @property {boolean} isLoading - True while the logout request is being processed
 * @property {boolean|undefined} isSuccess - True if logout was successful, false if failed
 * @property {Object|boolean} error - The error object ({status, message}) if failed, otherwise false
*/

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