/**
 * Browser Tracking Controller
 * Handles HTTP requests for browser extension tracking.
 */

const browserService = require("./service");

/**
 * Retrieves browser tracking data.
 * 
 * @param {Object} browserCollection - MongoDB browser collection.
 * @returns {Function} Express middleware function.
 */
const getBrowserData = (browserCollection) => async (req, res) => {
    try {
        const browserData = await browserService.fetchAllBrowserData(browserCollection);

        if (!browserData || browserData.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No browser data found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Browser data retrieved successfully',
            data: browserData,
        });
    } catch (error) {
        console.error('Error retrieving browser data:', error);
        return res.status(500).json({ 
            status: 500, 
            message: 'Internal server error' 
        });
    }
};

/**
 * Validates input and saves browser tracking data.
 * 
 * @param {Object} browserCollection - MongoDB browser collection.
 * @returns {Function} Express middleware function.
 */
const saveBrowserData = (browserCollection) => async (req, res) => {
    try {
        const { userAgent, language, screenWidth, screenHeight, extensions } = req.body;
        const SESSION_ID = req.signedCookies.session;
        const ipAddress = req.ip || req.connection.remoteAddress;

        console.log(req.body)

        if (!SESSION_ID) {
            return res.status(422).json({
                status: 422,
                message: 'Missing Session id'
            });
        }

        if (!userAgent) {
            return res.status(422).json({
                status: 422,
                message: 'Missing user agent'
            });
        }

        const result = await browserService.createBrowserSession(browserCollection, {
            sessionId: SESSION_ID,
            userAgent,
            language,
            screenWidth,
            screenHeight,
            extensions,
            ipAddress
        });

        if (!result) {
            return res.status(500).json({
                status: 500,
                message: 'Saving browser data failed'
            });
        }

        return res.status(201).json({
            status: 201,
            message: 'Browser data saved successfully',
            data: result
        });
    } catch (error) {
        console.error('Error saving browser data:', error);
        return res.status(500).json({ 
            status: 500,
            message: 'Internal server error' 
        });
    }
};

module.exports = {
    getBrowserData,
    saveBrowserData,
};