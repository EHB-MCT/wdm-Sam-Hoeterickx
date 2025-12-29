import { useEffect, useState } from "react"

//Service
import { adminService } from "../../services/admin/admin.service";

/**
 * Custom hook that handles the authentication status of the current user with role admin
 * Checks if there is a valid session upon component mount.
 * 
 * @returns {Object} - Auhtentication object
 * @property {boolean} isAdmin - True if the user role is admin
 * @property {boolean} isLoading - True while the authentication check is in progress
 * @property {boolean} isError - True if an error occurred during the check
 * @property {string|boolean} error - The error message (string) or false if no error occurred
 * @property {Object|undefined|null} user - The user object containing data (if logged in)
 * @property {string|undefined|null} role - The user role contains the role of the user admin/user (if logged in)
*/

export const useAdminAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(false);
    const [user, setUser] = useState(undefined);
    const [role, setRole] = useState();


    useEffect(() => {
        let isMounted = true;

        const authAdmin = async() => {
            try{
                const authenticadedAdmin = await adminService.authenticateAdmin();
                
                if (isMounted) {
                    console.log('Admin auth response:', authenticadedAdmin);
                    setUser(authenticadedAdmin.data);
                    setRole(authenticadedAdmin.data?.role || 'user');
                    
                    console.log('User role:', authenticadedAdmin.data?.role);
                    console.log('Is admin:', authenticadedAdmin.data?.role === 'admin');

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

        authAdmin();

        return () => {
            isMounted = false;
        };
    }, [])

    const isAdmin = role === 'admin'

    return { isAdmin, isLoading, isError, error, user, role};

}