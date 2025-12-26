const BASE_URL = `${import.meta.env.VITE_API_URL}/auth`

/**
 * Service class responsible for all authentication-related API calls.
*/

class AuthService {

    /**
     * Registers a new user.
     * 
     * @param {string} username - The desired username
     * @param {string} email - The email address
     * @param {string} password - The password
     * @param {string} repeatPassword - Password confirmation
     * @returns {Promise<Object>} The server response data upon success
     * @throws {Error} Throws an error if registration fails (e.g., email already exists)
     */
    async registerUser(username, email, password, repeatPassword){
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ 
                username, 
                email, 
                password, 
                repeatPassword 
            })
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to register');
        }

        return await response.json();
    }

    /**
     * Logs in a user and sets the session cookie.
     * 
     * @param {string} email - The user's email address
     * @param {string} password - The password
     * @returns {Promise<Object>} The user data and session info
     * @throws {Error} If login credentials are invalid
    */
    async loginUser(email, password){
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            credentials: 'include', 
            body: JSON.stringify({ 
                email, 
                password, 
            })
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to login');
        }

        return await response.json();
    }

    /**
     * Logs out the current user and removes the session cookie.
     * 
     * @returns {Promise<Object>} Success message from the server
     * @throws {Error} If the logout process fails
    */
    async logoutUser(){
        const response = await fetch(`${BASE_URL}/logout`, { 
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': "application/json" },
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to logout');
        }
        return await response.json();
    }

    /**
     * Checks if the user still has a valid session (e.g., on page refresh).
     * 
     * @returns {Promise<Object>} The user object if the session is valid
     * @throws {Error} If the authentication check fails (user not logged in)
    */
    async authenticateUser(){
        const response = await fetch(`${BASE_URL}/authenticate`, { 
            method: 'GET',
            credentials: 'include',
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to autenticate');
        }

        const data = await response.json();

        return data
    }
}

export const authService = new AuthService();