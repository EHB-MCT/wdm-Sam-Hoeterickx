import { useState } from "react"
import { adminService } from "../../services/admin/admin.service";

/**
 * Custom hook for collecting all user ID data for admin analysis
 * Provides functionality to fetch all user IDs from the system
 * 
 * @returns {Object} - User data collection object
 * @property {Function} collectData - Function to trigger user ID collection
 * @property {boolean} isLoading - True while data collection is in progress
 * @property {boolean} isError - True if an error occurred during collection
 * @property {Object|null} error - The error object ({status, message}) if failed, otherwise null
 */
export const useGetAllDataFromUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const collectData = async() => {
        setIsLoading(true);
        
        try{
            const data = await adminService.collectAllDataFromUsers();
            return data
        }catch(error){
            setIsError(true);
            setError({
                status: error.status, 
                message: error.message
            });
            return null;
        }finally{
            setIsLoading(false)
        }
    };

    return { collectData, isLoading, isError, error }
}