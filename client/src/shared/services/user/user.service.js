const BASE_URL = `${import.meta.env.VITE_API_URL}/user`;

class UserService {
    async getUserData(){
        const response = await fetch(`${BASE_URL}/`, {
            method: 'GET',
            credentials: 'include'
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to register');
        }

        return await response.json();
    }
}

export const userService = new UserService();