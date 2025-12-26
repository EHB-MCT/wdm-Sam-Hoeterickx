const { saveConfidence } = require("./model");

/**
 * Save confidence state
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} collection - Confidence_check collection
 * @param {String} SESSION_ID - Cookie of session id
 * @param {String} req.body.question_id - Id of the question
 * @param {String} req.body.selected_answer - String that contains the selelected answer
 * @param {String} req.body.decision_time - Duration of the desicion making
 * @param {Object} req.body.elapsed_hover_time - Duration of the hover time
 * @param {Object} req.body.changed_mind - Amount of times clicked on each option button
 * @returns 
 */
const saveConfidenceCheck = async (req, res, collection) => {
    try{
        const { changed_mind_state, elapsed_hover_time, decision_time } = req.body;
        const SESSION_ID = req.signedCookies.session;

        console.log(SESSION_ID, req.body);

        if(!SESSION_ID || changed_mind_state === undefined || elapsed_hover_time === undefined || decision_time === undefined){
            return res.status(422).send({
                status: 422,
                message: 'Missing credentials'
            });
        };

        const isConfidence = !changed_mind_state;
        
        const confidenceData = {
            SESSION_ID,
            isConfidence,
            elapsed_hover_time,
            decision_time
        };

        const result = await saveConfidence(collection, confidenceData);
        
        if(!result){
            return res.status(500).send({
                status: 500,
                message: 'Failed to save confidence data'
            })
        }

        return res.status(201).send({
            status: 201,
            message: 'Successfuly saved confidence data'
        })

    }catch(error){
        console.error('Failed to save confidence data:', error.message);
        return res.status(500).send({
            status: 500,
            message: error
        });
    }
}

module.exports = {
    saveConfidenceCheck
}