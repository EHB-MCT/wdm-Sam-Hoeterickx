import { useEffect, useState } from "react"

//Service
import { authService } from "../../services";

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