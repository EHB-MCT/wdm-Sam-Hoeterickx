class AuthService {
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
}

export const authService = new AuthService();