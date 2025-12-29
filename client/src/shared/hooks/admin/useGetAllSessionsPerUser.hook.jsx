import { useState, useCallback } from "react"
import { adminService } from "../../services/admin/admin.service"

/**
 * Custom hook for collecting all user sessions with detailed analytics
 * Provides functionality to fetch comprehensive session data grouped by user
 * 
 * @returns {Object} - Session data collection object
 * @property {Function} collectSessionData - Function to trigger session data collection
 * @property {boolean} isLoading - True while data collection is in progress
 * @property {boolean} isError - True if an error occurred during collection
 * @property {Object|null} error - The error object ({status, message}) if failed, otherwise null
 * @property {Object|null} data - The collected session data object or null if failed
 */
export const useGetAllSessionsPerUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const collectSessionData = useCallback(async() => {
        setIsLoading(true);
        setIsError(false);
        setError(null);
        
        try{
            const response = await adminService.collectAllSessionsPerUser();
            setData(response.data);
            return response.data;
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
    }, []);

    return { collectSessionData, isLoading, isError, error, data }
}