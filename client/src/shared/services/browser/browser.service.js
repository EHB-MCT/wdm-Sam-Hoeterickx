/**
 * Browser Tracking Service (Frontend)
 * Handles interactions with the backend browser tracking API.
 */

const BASE_URL = `${import.meta.env.VITE_API_URL}/browser`;

class BrowserService {

    /**
     * Fetches all recorded browser session data from the server.
     * 
     * @returns {Promise<Array<Object>>} A promise that resolves to the list of browser sessions.
     * @throws {Error} If the network request fails.
    */
    async fetchBrowserData(){
        try {
            const response = await fetch(`${BASE_URL}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Browser Service Error:', error);
            throw error;
        }
    }

    /**
     * Collects current environment metrics and sends them to the tracking endpoint.
     * * Automatically captures:
     * - User Agent
     * - Language
     * - Screen Width/Height
     * 
     * @param {Array<string>} [detectedExtensions=[]] - An array of extension names/IDs detected by your detection scripts.
     * @returns {Promise<Object>} The server response containing the saved session ID.
    */
    async trackCurrentSession(detectedExtensions = []){
        const brands = navigator.userAgentData.brands;

        try {
            const payload = {
                userAgent: navigator.userAgent,
                platform: navigator.userAgentData.platform,
                brand: brands[0],
                browserVersion: brands[1],
                language: navigator.language || navigator.userLanguage,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                extensions: detectedExtensions
            };

            console.log('payload:', payload);

            const response = await fetch(`${BASE_URL}/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to track session');
            }

            return await response.json();
        } catch (error) {
            console.error('Tracking Service Error:', error);
            throw error;
        }
    }
}

export const browserService = new BrowserService();