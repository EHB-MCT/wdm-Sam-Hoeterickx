const { saveAnswer, getAllAnswers } = require('./model.js');

/**
 * Get all answers in database
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} collection - Answer collection
 * @returns 
 */
const getAnswers = async(req, res, collection) => {
    try{

        const answers = await getAllAnswers(collection);
        
        if(!answers){
            return res.status(404).send({
                status: 404,
                message: 'No answers found'
            });
        }

        return res.status(200).send({
            status: 200,
            message: 'Answers found successfully',
            data: answers
        })

    }catch(error){
        console.error('Get answers error:', error);
        return res.status(500).send({
            status: 500,
            message: error.message
        });
    }
}

/**
 * Save answer in database on question id
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} collection - Answer collection
 * @param {String} SESSION_ID - Cookie of session id
 * @param {String} req.body.question_id - Id of the question
 * @param {String} req.body.selected_answer - String that contains the selelected answer
 * @param {String} req.body.desicion_time - Duration of the desicion making
 * @param {Object} req.body.elapsed_hover_time - Duration of the hover time
 * @param {Object} req.body.changed_mind - Amount of times clicked on each option button
 * @returns 
 */
const answerQuestion = async(req, res, collection) => {
    try{

        const SESSION_ID = req.signedCookies.session;
        const { question_id, selected_answer, decision_time, elapsed_hover_time, changed_mind } = req.body;

        if(!SESSION_ID || !question_id || !selected_answer || !decision_time || !elapsed_hover_time || !changed_mind){
            return res.status(422).send({
                status: 422,
                message: 'Missing info'
            })
        }

        const answerData = {
            session_id: SESSION_ID,
            question_id,
            selected_answer,
            decision_time,
            elapsed_hover_time,
            changed_mind,
        }

        const result = await saveAnswer(collection, answerData);
        if(!result){
            return res.status(500).send({
                status: 500,
                message: 'Failed to save answer'
            })
        }

        return res.status(201).send({
            status: 201,
            message: 'Answer saved successfully'
        });

    }catch(error){
        console.error('Create answer error:', error);
        return res.status(500).send({
            status: 500,
            message: error.message
        })
    }
}

module.exports = {
    answerQuestion,
    getAnswers
}