const BASE_URL = `${import.meta.env.VITE_API_URL}/session/sessionId`;

class SessionService {
    async createSession(){
        const response = await fetch(BASE_URL, {
            credentials: 'include'
        })

        if(!response.ok){
            throw new Error('Failed to fetch Session data');
        }

        const DATA = await response.json();
        return DATA;
    }    
}

export const sessionService = new SessionService();