const BASE_URL = `${import.meta.env.VITE_API_URL}/admin`;

class AdminService {
    async authenticateAdmin(){
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

    async collectAllData(){
        const response = await fetch(`${BASE_URL}/data`, { 
            method: 'GET',
            credentials: 'include',
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to collect data');
        }

        const data = await response.json();

        return data
    }
}

export const adminService = new AdminService();