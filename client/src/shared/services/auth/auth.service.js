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
            const errorData = await response.json();
            console.log(errorData)
            throw new Error(`${errorData.status} | ${errorData.message}` || 'Failed to register');
        }

        const data = await response.json();
        return data;
    }
}