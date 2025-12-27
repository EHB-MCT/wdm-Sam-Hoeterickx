const { sortQuestionsById } = require('./service');

/**
 * Get all questions from database
 * @param {Object} collection - Question collection
 * @returns {Promise<Array>} Array of question documents sorted by ID
 * @throws {Error} When database query fails
 */
const getAllQuestions = async(collection) => {
    const result = await collection.find({}).toArray();
    
    if (!result || result.length === 0) {
        return [];
    }

    return sortQuestionsById(result);
};

/**
 * Find next question
 * @param {Object} collection - Question collection
 * @param {number} currentQuestionId - ID of current question
 * @returns {Promise<Object|null>} Next question document or null if not found
 * @throws {Error} When database query fails
 */
const findNextQuestion = async(collection, currentQuestionId) => {
    const nextQuestionId = currentQuestionId + 1;

    return await collection.findOne({
        _id: nextQuestionId
    });
};

/**
 * Insert all questions in database
 * @param {Object} collection - Question collection
 * @param {Array<Object>} questions - Array of question objects
 * @returns {Promise<Object>} MongoDB insert result
 * @throws {Error} When insertion fails
 */
const insertAllQuestions = async(collection, questions) => {
    return await collection.insertMany(questions);
};

module.exports = {
    getAllQuestions,
    findNextQuestion,
    insertAllQuestions
};