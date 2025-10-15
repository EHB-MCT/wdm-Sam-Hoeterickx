const { generateSessionId } = require('./model.js');

const createSessionId = async (req, res, collection) => {
    try{

        const SESSION_ID = generateSessionId();

        if(!SESSION_ID){
            return res.status(500).send({
                status: 500,
                message: 'Failed to create session id',
            })
        }

        const result = collection.insertOne(SESSION_ID);

        if(!result){
            return res.status(500).send({
                status: 500,
                message: 'Failed to save session id',
            })
        }

        return res.status(201).send({
            status: 201,
            message: 'Session created successfully',
            sessionId: SESSION_ID
        })


    }catch(error){
        console.error('Session id creation error:', error);
        res.status(500).send({
            status: 500,
            message: error.message
        })
    }
}

module.exports = {
    createSessionId
}