import { useEffect, useState } from "react"

//Service
import { authService } from "../../services";

/**
 * Custom hook that handles the authentication status of the current user
 * Checks if there is a valid session upon component mount.
 * 
 * @returns {Object} - Auhtentication object
 * @property {boolean} isAuthenticated - True if the user has successfully logged in
 * @property {boolean} isLoading - True while the authentication check is in progress
 * @property {boolean} isError - True if an error occurred during the check
 * @property {string|boolean} error - The error message (string) or false if no error occurred
 * @property {Object|undefined|null} user - The user object containing data (if logged in)
*/

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(false);
    const [user, setUser] = useState(undefined);


    useEffect(() => {
        let isMounted = true;

        const authMe = async() => {
            try{
                const authenticadedUser = await authService.authenticateUser();
                
                if (isMounted) {
                    setUser(authenticadedUser.data);
                    setIsError(false);
                }
            }catch(error){

                if (isMounted) {
                    setUser(null);
                    setIsError(true);
                    setError(error.message);
                }

            }finally{
                if (isMounted) setIsLoading(false);
            }
        }

        authMe();

        return () => {
            isMounted = false;
        };
    }, [])

    const isAuthenticated = !!user && !isError;

    return { isAuthenticated, isLoading, isError, error, user};

}