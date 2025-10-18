const getAllQuestions = async(collection) => {
    const result = await collection.find({}).toArray();

    if(!result){
        return result
    }

    const sortedQuestionsList = result.sort((a, b) => a._id - b._id);

    return sortedQuestionsList

}

const findNextQuestion = async(collection, question_id) => {
    const next_question_id = question_id + 1;
    console.log(next_question_id)

    const result = await collection.findOne({
        _id: next_question_id
    })

    return result
}

module.exports = {
    getAllQuestions,
    findNextQuestion
}