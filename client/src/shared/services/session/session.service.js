const BASE_URL = `${import.meta.env.VITE_API_URL}/session`;

class SessionService {
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