const BASE_URL = `${import.meta.env.VITE_API_URL}/auth`;

class AuthService {
    async registerUser(username, email, password, repeatPassword){
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: {
                username,
                email,
                password,
                repeatPassword
            }
        });
        if(!response.ok){
            throw new Error(`Failed to fetch prediction: ${response.statusText}`);
        }
        
        const DATA = response.json();
        return DATA
    }
}