/**
 * Browser Tracking Service (Frontend)
 * Handles interactions with the backend browser tracking API.
 */

const BASE_URL = `${VITE_API_URI}/browser` 

/**
 * Fetches all recorded browser session data from the server.
 * 
 * @returns {Promise<Array<Object>>} A promise that resolves to the list of browser sessions.
 * @throws {Error} If the network request fails.
 */
export const fetchBrowserData = async () => {
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
};

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
export const trackCurrentSession = async (detectedExtensions = []) => {
    try {
        const payload = {
            userAgent: navigator.userAgent,
            language: navigator.language || navigator.userLanguage,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            extensions: detectedExtensions
        };

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
};