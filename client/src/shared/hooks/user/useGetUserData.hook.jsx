import { useCallback, useEffect, useState } from "react";
import { userService } from "../../services"

export const useGetUserData = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(false);
    const [user, setUser] = useState();

    const getMyData = async() => {
        setIsLoading(true);

        try{
            const data = await userService.getUserData();
            console.log(data);

            setUser(data.data.user);
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
    }

    return { getMyData, user, isLoading, isError, error };
}