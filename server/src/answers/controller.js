const { saveAnswer } = require('./model.js');

const answerQuestion = async(req, res, collection) => {
    try{

        const SESSION_ID = req.signedCookies.session;
        const { question_id, selected_answer, decision_time, elapsed_hover_time, changed_mind } = req.body;

        if(!SESSION_ID || !question_id || !selected_answer || !decision_time || !elapsed_hover_time || !changed_mind){
            return res.status(401).send({
                status: 401,
                message: 'Missing info'
            })
        }

        const result = await saveAnswer(collection, SESSION_ID, question_id, selected_answer, decision_time, elapsed_hover_time, changed_mind);

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
    answerQuestion
}