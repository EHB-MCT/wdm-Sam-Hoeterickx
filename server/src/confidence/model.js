/**
 * Insert the confidece data in the database
 * 
 * @param {Object} collection - Answer collection 
 * @param {Object} confidenceData - The object containing all confidence details
 * @returns
 */
const saveConfidence = async (collection, confidenceData) => {
    return await collection.insertOne({
        session_id: confidenceData.SESSION_ID,
        isConfidence: confidenceData.isConfidence,
        elapsed_hover_time: confidenceData.elapsed_hover_time,
        decision_time: confidenceData.decision_time,
        createdAt: new Date()
    });
}

/**
 * Saves the answer data to the database.
 * 
 * @param {Object} collection - Answer collection 
 * @param {Array<string>} session_ids - Array of session ID strings
 * @returns
 */
const findAllConfidencesWithSessionId = async (collection, session_ids) => {
    return await collection.find({
        session_id: { $in: session_ids }
    }).toArray();
}

module.exports = {
    saveConfidence,
    findAllConfidencesWithSessionId
}