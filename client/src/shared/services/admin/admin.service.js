const BASE_URL = `${import.meta.env.VITE_API_URL}/admin`;

/**
 * Service class for admin-related API calls
 * Provides methods for admin authentication, data collection, and user management
 */
class AdminService {

    /**
     * Authenticate admin user and verify admin privileges
     * @returns {Promise<Object>} Authentication response with admin user data
     * @throws {Error} When authentication fails or user is not an admin
     */
    async authenticateAdmin(){
        const response = await fetch(`${BASE_URL}/authenticate`, { 
            method: 'GET',
            credentials: 'include',
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to authenticate');
        }

        const data = await response.json();
        return data;
    }

    /**
     * Collect all data from all collections for comprehensive admin analysis
     * @returns {Promise<Object>} Complete dataset containing users, answers, sessions, browser data, etc.
     * @throws {Error} When data collection fails
     */
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
        return data;
    }

    /**
     * Get all user IDs for admin analysis
     * @returns {Promise<Object>} Response containing array of user IDs
     * @throws {Error} When user ID collection fails
     */
    async collectAllDataFromUsers(){
        const response = await fetch(`${BASE_URL}/`, { 
            method: 'GET',
            credentials: 'include'
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to collect user data');
        }

        const data = await response.json();
        return data;
    }

    /**
     * Get all sessions grouped by user with detailed analytics
     * @returns {Promise<Object>} Response containing users with their sessions and analytics
     * @throws {Error} When session data collection fails
     */
    async collectAllSessionsPerUser(){
        const response = await fetch(`${BASE_URL}/sessions`, { 
            method: 'GET',
            credentials: 'include'
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to collect session data');
        }

        const data = await response.json();
        return data;
    }
}

export const adminService = new AdminService();