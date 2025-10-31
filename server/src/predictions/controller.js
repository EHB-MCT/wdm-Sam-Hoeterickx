const { savePredictionData } = require('./model.js')

const savePrediction = async (req, res, collection) => {
    try{

        const { changed_mind_state, elapsed_hover_time, descion_time } = req.body;
        const sessionId = req.signedCookies.session;

        if(!changed_mind_state || !elapsed_hover_time || !descion_time || !sessionId){
            return res.status(401).send({
                status: 401,
                message: 'Missing info'
            });
        }

        const result = await savePredictionData(collection, sessionId, changed_mind_state, elapsed_hover_time, descion_time);

        if(!result){
            return res.status(400).send({
                status: 400,
                message: 'Failed to save prediction state'
            })
        }
        
        return res.status(201).send({
            status: 201,
            message: 'Saved prediction state successfully'
        })

    }catch(error){
        console.error('Failed to save prediction state:', error.message);
        return res.status(500).send({
            status: 500,
            message: error
        });
    }
}

module.exports = {
    savePrediction
}