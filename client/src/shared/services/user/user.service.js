const BASE_URL = `${import.meta.env.VITE_API_URL}/users`;

/**
 * Service class responsible for handling user-related API interactions.
 * Fetches profile data for the currently authenticated user.
*/

class UserService {

    /**
     * Retrieves the profile information of the currently logged-in user.
     * 
     * @returns {Promise<Object>} The user data object from the server
     * @throws {Error} If the request fails (e.g., unauthorized or server error)
    */
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