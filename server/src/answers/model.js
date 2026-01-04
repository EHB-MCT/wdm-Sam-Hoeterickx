/**
 * Get all answers from answer collection
 * @param {Object} collection - Answer collection
 * @returns {Promise<Array>} Array of all answer documents
 * @throws {Error} When database query fails
 */
const getAllAnswers = async(collection) => {
    return await collection.find({}).toArray();
};

/**
 * Saves answer data to database
 * @param {Object} collection - Answer collection 
 * @param {Object} answerData - The object containing all answer details
 * @param {string} answerData.session_id - Session identifier
 * @param {string} answerData.question_id - Question identifier
 * @param {string} answerData.selected_answer - Selected answer
 * @param {number} answerData.decision_time - Time taken to make decision
 * @param {Object} answerData.elapsed_hover_time - Hover time data
 * @param {Object} answerData.changed_mind - Changed mind data
 * @param {Date} answerData.created_at - Creation timestamp
 * @returns {Promise<Object>} MongoDB insert result
 * @throws {Error} When insertion fails
 */
const saveAnswer = async(collection, answerData) => {
    return await collection.insertOne(answerData);
};

/**
 * Finds all answers belonging to a list of session IDs
 * @param {Object} collection - Answer collection
 * @param {Array<string>} sessionIds - Array of session ID strings
 * @returns {Promise<Array>} Array of answer documents
 * @throws {Error} When database query fails
 */
const findAllAnswerWithSessionId = async (collection, sessionIds) => {
    return await collection.find({
        session_id: { $in: sessionIds }
    }).toArray();
};

module.exports = {
    getAllAnswers,
    saveAnswer,
    findAllAnswerWithSessionId
};