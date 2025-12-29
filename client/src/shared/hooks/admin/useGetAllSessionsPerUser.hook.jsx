import { useState, useCallback } from "react"
import { adminService } from "../../services/admin/admin.service"

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