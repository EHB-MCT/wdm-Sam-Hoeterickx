import { userService } from "../../services"

export const useGetUserData = () => {
    const getUserData = async() => {
        const data = await userService.getUserData();

        console.log(data);
    }

    return getUserData;
}