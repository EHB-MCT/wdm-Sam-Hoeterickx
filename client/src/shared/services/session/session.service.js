const BASE_URL = 'http://localhost:3000/api/session/sessionId';

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