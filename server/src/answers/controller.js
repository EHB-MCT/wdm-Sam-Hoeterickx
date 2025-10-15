const answerQuestion = (req, res, collection) => {
    try{

        const SESSION_ID = req.signedCookies.session;
        console.log("session id", SESSION_ID);

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