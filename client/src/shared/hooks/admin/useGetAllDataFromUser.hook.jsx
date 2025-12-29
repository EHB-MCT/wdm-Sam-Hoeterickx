import { useState } from "react"
import { adminService } from "../../services/admin/admin.service";

export const useGetAllDataFromUser = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);

    const collectData = async() => {
        setIsLoading(true);
        
        try{
            const data = await adminService.collectAllDataFromUsers();
            console.log(data);

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