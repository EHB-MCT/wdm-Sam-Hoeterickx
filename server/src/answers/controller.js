const answerQuestion = (req, res, collection) => {
    try{

        

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