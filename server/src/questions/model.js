/**
 * Get all questions from database
 * 
 * @param {Object} collection - Question collection
 * @returns 
*/
const getAllQuestions = async(collection) => {
    const result = await collection.find({}).toArray();

    if(!result){
        return result
    }

    return sortedQuestionsList = result.sort((a, b) => a._id - b._id);
}

/**
 * Find next question
 * 
 * @param {Object} collection - Question collection
 * @param {Number} question_id - id of the current question
 * @returns 
*/
const findNextQuestion = async(collection, question_id) => {
    const next_question_id = question_id + 1;

    return await collection.findOne({
        _id: next_question_id
    })
}

/**
 * Insert all questions in the database
 * 
 * @param {Object} collection - Question collection
 * @param {Array<Object>} questions - Array of all the questions
 * @returns 
*/
const insertAllQuestions = async(collection,questions) => {
    return await collection.insertMany(questions);
}

module.exports = {
    getAllQuestions,
    findNextQuestion,
    insertAllQuestions
}