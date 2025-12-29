import { useEffect, useState } from "react"
import { adminService } from "../../services/admin/admin.service";

/**
 * Custom hook for collecting all admin data from all collections
 * Provides functionality to fetch comprehensive dataset for admin analysis
 * 
 * @returns {Object} - Admin data collection object
 * @property {Function} collectData - Function to trigger data collection
 * @property {boolean} isLoading - True while data collection is in progress
 * @property {boolean} isError - True if an error occurred during collection
 * @property {Object|null} error - The error object ({status, message}) if failed, otherwise null
 */
export const useGetAllData = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const collectData = async() => {
        setIsLoading(true);
        
        try{
            const data = await adminService.collectAllData();
            return data;

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