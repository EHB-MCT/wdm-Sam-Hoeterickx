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

    async loginUser(email, password){
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: {
                email,
                password,
            }
        });

        if(!response.ok){
            const errorData = await response.json();
            console.log(errorData)
            throw new Error(`${errorData.status} | ${errorData.message}` || 'Failed to login');
        }

        const data = await response.json();
        return data;
    }
}