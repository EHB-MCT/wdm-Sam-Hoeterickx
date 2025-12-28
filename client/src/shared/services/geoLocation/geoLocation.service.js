const BASE_URL = `${import.meta.env.VITE_API_URL}/geolocation`;

/**
 * Service class responsible for all geoLocation-related API calls.
*/

class GeoLocationService {

    /**
     * Registers a new user.
     * 
     * @param {Object} locationData - The desired username
     * @returns {Promise<Object>} The server response data upon success
     * @throws {Error} Throws an error if saving fails
     */
    async saveGeoLocation(locationData, ){
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