const { saveConfidence } = require("./model");
const { 
    prepareConfidenceData, 
    validateConfidenceRequestData, 
    validateSessionForConfidence 
} = require("./service");

/**
 * Save confidence state
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} confidenceCollection - Confidence collection
 */
const saveConfidenceCheck = async (req, res, confidenceCollection) => {
    try {
        const sessionId = req.signedCookies.session;
        validateSessionForConfidence(sessionId);

        const { changed_mind_state, elapsed_hover_time, decision_time } = req.body;

        validateConfidenceRequestData({
            changed_mind_state,
            elapsed_hover_time,
            decision_time
        });

        const preparedData = prepareConfidenceData(
            { changed_mind_state, elapsed_hover_time, decision_time },
            sessionId
        );

        const result = await saveConfidence(confidenceCollection, preparedData);
        
        if (!result) {
            return res.status(500).json({
                status: 500,
                message: 'Failed to save confidence data'
            });
        }

        return res.status(201).json({
            status: 201,
            message: 'Successfully saved confidence data'
        });

    } catch (error) {
        console.error('Failed to save confidence data:', error.message);
        
        if (error.message.includes('required') || error.message.includes('must be')) {
            return res.status(400).json({
                status: 400,
                message: error.message
            });
        }

        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

module.exports = {
    saveConfidenceCheck
};