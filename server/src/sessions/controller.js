const createSessionId = (req, res, collection) => {
    try{

    }catch(error){
        console.error('Session id creation error:', error);
        res.status(500).send({
            status: 500,
            message: error.message
        })
    }
}

module.exports{
    createSessionId
}