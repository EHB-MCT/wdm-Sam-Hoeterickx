const { saveAnswer, getAllAnswers } = require('./model.js');
const { validateAnswerData, prepareAnswerData, validateSessionForAnswer } = require('./service.js');

/**
 * Get all answers in database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} answerCollection - Answer collection
 */
const getAnswers = async(req, res, answerCollection) => {
    try {
        const answers = await getAllAnswers(answerCollection);
        
        if (!answers || answers.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No answers found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Answers found successfully',
            data: answers
        });

    } catch (error) {
        console.error('Get answers error:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

/**
 * Save answer in database on question id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} answerCollection - Answer collection
 */
const answerQuestion = async(req, res, answerCollection) => {
    try {
        const sessionId = req.signedCookies.session;
        validateSessionForAnswer(sessionId);

        const { question_id, selected_answer, decision_time, elapsed_hover_time, changed_mind } = req.body;

        const answerData = {
            session_id: sessionId,
            question_id,
            selected_answer,
            decision_time,
            elapsed_hover_time,
            changed_mind
        };

        validateAnswerData(answerData);
        const preparedData = prepareAnswerData(answerData);

        const result = await saveAnswer(answerCollection, preparedData);
        if (!result) {
            return res.status(500).json({
                status: 500,
                message: 'Failed to save answer'
            });
        }

        return res.status(201).json({
            status: 201,
            message: 'Answer saved successfully'
        });

    } catch (error) {
        console.error('Create answer error:', error);
        
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
    answerQuestion,
    getAnswers
};