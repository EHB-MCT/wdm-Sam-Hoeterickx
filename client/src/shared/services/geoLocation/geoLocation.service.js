const BASE_URL = `${import.meta.env.VITE_API_URL}/geolocation`;

/**
 * Service class responsible for all geoLocation-related API calls.
*/

class GeoLocationService {

    /**
     * Get all geolocatoin data
     * 
     * @returns {Promise<Object>} The server response data upon success 
    */
    async getAllGeoLocationData(){
        const response = await fetch(`${BASE_URL}/`);
        
        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get geolocation data');
        }

        return await response.json();
    }


    /**
     * Saves geolocation data when available.
     * 
     * @param {Object} locationData - The desired username
     * @returns {Promise<Object>} The server response data upon success
     * @throws {Error} Throws an error if saving fails
     */
    async saveGeoLocation(locationData){

        if (!locationData) {
            return
        }

        const response = await fetch(`${BASE_URL}/save`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                ...locationData,
            })
        });

        if(!response.ok){
            const errorData = await response.json();
            new Error(errorData.message || 'Failed to save geoLocation');
        }

        return await response.json();
    }
}

export const geoLocationService = new GeoLocationService();