const { generateSessionId, saveSessionId } = require('./model.js');

const createSessionId = async (req, res, collection) => {
    try{

        const USER_ID = req.signedCookies.user;
        const CURRENT_SESSION_ID = req.signedCookies.session;
        const QUESTION_ID = req.query.q;

        if(CURRENT_SESSION_ID && QUESTION_ID !== '1'){
            return res.status(200).send({
                status: 200,
                message: 'Session id already excists',
                sessionId: CURRENT_SESSION_ID
            });
        }

        const SESSION_ID = generateSessionId();
        if(!SESSION_ID){
            return res.status(500).send({
                status: 500,
                message: 'Failed to create session id',
            });
        }

        const result = await saveSessionId(collection, SESSION_ID, USER_ID);
        if(!result){
            return res.status(500).send({
                status: 500,
                message: 'Failed to save session id',
            });
        }

        res.cookie('session', SESSION_ID, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            signed: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

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

const readCookie = (req, res) => {

    const SESSION_ID = req.signedCookies.session;
    console.log(SESSION_ID);

    res.send({
        message: "ok"
    })
}


module.exports = {
    createSessionId,
    readCookie
}