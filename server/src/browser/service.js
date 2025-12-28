/**
 * Browser Tracking Service
 * Handles business logic and coordinates between Controller and Model.
 */

const { findAllBrowserSessions, insertBrowserData } = require("./model");

/**
 * Retrieves all browser tracking data.
 *
 * @param {Object} browserCollection - The MongoDB browser collection.
 * @returns {Promise<Array<Object>>} The list of browser data.
 */
const fetchAllBrowserData = async (browserCollection) => {
    return await findAllBrowserSessions(browserCollection);
};

/**
 * Prepares and saves new browser tracking data.
 *
 * @param {Object} browserCollection - The MongoDB browser collection.
 * @param {Object} data - The raw data payload.
 * @param {string} data.sessionId - The secure session ID.
 * @param {string} data.userAgent - The user agent string.
 * @param {string} [data.language] - The browser language.
 * @param {number} [data.screenWidth] - The screen width.
 * @param {number} [data.screenHeight] - The screen height.
 * @param {Array} [data.extensions] - List of installed extensions.
 * @param {string} data.ipAddress - The client IP address.
 * @returns {Promise<Object>} The result of the insertion.
 */
const createBrowserSession = async (browserCollection, data) => {
    const browserData = {
        session_id: data.sessionId,
        user_agent: data.userAgent,
        platform: data.platform,
        brand: data.brand,
        browser_version: data.browserVersion, 
        language: data.language || 'unknown',
        screen_width: data.screenWidth || 0,
        screen_height: data.screenHeight || 0,
        extensions: data.extensions || [],
        ip_address: data.ipAddress,
        timestamp: new Date(),
    };

    return await insertBrowserData(browserCollection, browserData);
};

module.exports = {
    fetchAllBrowserData,
    createBrowserSession
};