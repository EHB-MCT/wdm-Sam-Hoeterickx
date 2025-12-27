/**
 * Insert confidence data in database
 * @param {Object} collection - Confidence collection 
 * @param {Object} confidenceData - The object containing all confidence details
 * @param {string} confidenceData.session_id - Session identifier
 * @param {boolean} confidenceData.isConfidence - Confidence state
 * @param {Object} confidenceData.elapsed_hover_time - Hover time data
 * @param {number} confidenceData.decision_time - Time taken for decision
 * @param {Date} confidenceData.created_at - Creation timestamp
 * @returns {Promise<Object>} MongoDB insert result
 * @throws {Error} When insertion fails
 */
const saveConfidence = async (collection, confidenceData) => {
    return await collection.insertOne(confidenceData);
};

/**
 * Finds all confidence records belonging to a list of session IDs
 * @param {Object} collection - Confidence collection
 * @param {Array<string>} sessionIds - Array of session ID strings
 * @returns {Promise<Array>} Array of confidence documents
 * @throws {Error} When database query fails
 */
const findAllConfidencesWithSessionId = async (collection, sessionIds) => {
    return await collection.find({
        session_id: { $in: sessionIds }
    }).toArray();
};

module.exports = {
    saveConfidence,
    findAllConfidencesWithSessionId
};