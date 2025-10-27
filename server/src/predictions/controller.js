const { savePredictionChangedMind } = require('./model.js')

const savePrediction = async (req, res, collection) => {
    try{

        const { changedMindState } = req.body;
        const sessionId = req.signedCookies.session;

        const result = await savePredictionChangedMind(collection, sessionId, changedMindState);

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