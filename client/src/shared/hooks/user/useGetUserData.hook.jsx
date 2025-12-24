import { useCallback } from "react";
import { userService } from "../../services"

export const useGetUserData = () => {
    const getMyData = useCallback(async () => {
        const data = await userService.getUserData();
        console.log(data);
    }, []);

    return { getMyData };
}