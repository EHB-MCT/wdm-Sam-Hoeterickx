/**
 * Browser Tracking Controller
 * Handles HTTP requests for browser extension tracking
*/


/**
 * Retrieves browser tracking data by session ID
 * 
 * @param {Object} browserCollection - MongoDB browser collection
 * @returns {Function} Express middleware function
*/
const getBrowserData = (browserCollection) => async (req, res) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId) {
            return res.status(422).json({
                status: 422,
                message: 'Missing info'
            });
        }

        const browserData = await browserCollection.find({ sessionId }).sort({ timestamp: -1 }).toArray();

        if (browserData.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No browser data found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'Browser data retrieved successfully',
            data: browserData,
        });
    } catch (error) {
        console.error('Error retrieving browser data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    };

/**
 * Saves browser tracking data
 * 
 * @param {Object} browserCollection - MongoDB browser collection
 * @returns {Function} Express middleware function
*/
const saveBrowserData = (browserCollection) => async (req, res) => {
    try {
        const { userAgent, language, screenWidth, screenHeight, extensions, sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        if (!userAgent) {
            return res.status(400).json({ error: 'User agent is required' });
        }

        const browserData = {
            sessionId,
            userAgent,
            language: language || 'unknown',
            screenWidth: screenWidth || 0,
            screenHeight: screenHeight || 0,
            extensions: extensions || [],
            timestamp: new Date(),
            ipAddress: req.ip || req.connection.remoteAddress,
        };

        // Save to database
        const result = await browserCollection.insertOne(browserData);

        res.status(201).json({
            message: 'Browser data saved successfully',
            data: {
                id: result.insertedId,
                ...browserData,
            },
        });
    }catch (error) {
        console.error('Error saving browser data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getBrowserData,
    saveBrowserData,
};