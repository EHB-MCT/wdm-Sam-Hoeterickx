const { getAllQuestions, insertAllQuestions } = require('./model.js');
const { getInitialQuestions, validateQuestionsArray } = require('./service.js');

/**
 * Get all questions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} questionsCollection - Question collection
 */
const getQuestions = async(req, res, questionsCollection) => {
    try {
        const questions = await getAllQuestions(questionsCollection);

        if (!questions || questions.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Questions not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Questions found successfully',
            data: questions
        });

    } catch (error) {
        console.error('Get questions error:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

/**
 * Add initial questions to database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} questionsCollection - Question collection
 */
const addQuestions = async(req, res, questionsCollection) => {
    try {
        const questions = getInitialQuestions();
        validateQuestionsArray(questions);

        const result = await insertAllQuestions(questionsCollection, questions);

        if (!result) {
            return res.status(500).json({
                status: 500,
                message: 'Failed to insert questions'
            });
        }

        return res.status(201).json({
            status: 201,
            message: 'Successfully inserted questions',
            data: {
                insertedCount: result.insertedCount,
                insertedIds: result.insertedIds
            }
        });

    } catch (error) {
        console.error('Post questions error:', error);
        
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
    getQuestions,
    addQuestions
};