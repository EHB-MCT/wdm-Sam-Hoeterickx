/**
 * Get all answers from the answer collection
 * 
 * @param {Object} collection - Answer collection
 * @returns 
 */
const getAllAnswers = async(collection) => {
    return await collection.find({}).toArray();
}

/**
 * Saves the answer data to the database.
 * 
 * @param {Object} collection - Answer collection 
 * @param {Object} answerData - The object containing all answer details
 * @returns
 */
const saveAnswer = async(collection, answerData) => {
    return await collection.insertOne({
        session_id: answerData.session_id,
        question_id: answerData.question_id,
        selected_answer: answerData.selected_answer,
        decision_time: answerData.decision_time,
        elapsed_hover_time: answerData.elapsed_hover_time,
        changed_mind: answerData.changed_mind,
        created_at: new Date()
    });
}

/**
 * Finds all answers belonging to a list of session IDs.
 * 
 * @param {Object} collection - Answer collection
 * @param {Array<string>} session_ids - Array of session ID strings
 * @returns 
 */
const findAllAnswerWithSessionId = async (collection, session_ids) => {
    return await collection.find({
        session_id: { $in: session_ids }
    }).toArray();
}

module.exports = {
    getAllAnswers,
    saveAnswer,
    findAllAnswerWithSessionId,
}