const getAllQuestions = (req, res, collection) => {
    try{

        const QUESTIONS = collection
        console.log(QUESTIONS);

        if(!QUESTIONS){
            return res.status(404).send({
                status: 404,
                message: 'Questions not found'
            })
        }

        return res.status(200).send({
            status: 200,
            message: 'Questions found successfully',
            data: QUESTIONS
        })

    }catch(error){
        console.error('Get questions error:', error);
        return res.status(500).send({
            status: 500,
            message: error.message
        })
    }
}

module.exports = {
    getAllQuestions
}