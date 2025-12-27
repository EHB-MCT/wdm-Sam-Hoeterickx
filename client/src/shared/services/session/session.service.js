const BASE_URL = `${import.meta.env.VITE_API_URL}/session`;

/**
 * Service class responsible for managing the session lifecycle.
 * Handles creating new anonymous sessions and persisting them to user accounts.
*/

class SessionService {

    /**
     * Initializes a new session or retrieves the current one based on the local question ID.
     * Often used at app startup to track the user.
     *
     * @returns {Promise<Object>} The session data from the server
     * @throws {Error} If the session fetch request fails
    */
    async createSession(){
        const question_id = localStorage.getItem('question_id');

        const response = await fetch(`${BASE_URL}/sessionId?q=${question_id}`, {
            credentials: 'include'
        });

        if(!response.ok){
            throw new Error('Failed to fetch Session data');
        }

        const DATA = await response.json();
        return DATA;
    }

    /**
     * Saves the current (anonymous) session data to the currently authenticated user's account.
     * 
     * @returns {Promise<Object>} The server response confirming the save
     * @throws {Error} If the save operation fails
     */
    async saveSession(){
        const response = await fetch(`${BASE_URL}/save`, {
            method: 'POST',
            credentials: 'include'
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save session to account');
        }

        const data = await response.json();
        console.log(data);

        return data;
    }
}

export const sessionService = new SessionService();