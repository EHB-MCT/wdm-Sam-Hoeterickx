import { useEffect, useState } from "react"
import { adminService } from "../../services/admin/admin.service";

export const useGetAllData = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(false);

    const collectData = async() => {
        setIsLoading(true);
        
        try{
            const data = await adminService.collectAllData();
            console.log(data);
            
            setIsLoading(false)

        }catch(error){
            setIsError(true);
            setError({
                status: error.status, 
                message: error.message
            });
        }finally{
            setIsLoading(false)
        }
    };

    return { collectData, isLoading, isError, error }
}