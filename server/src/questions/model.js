const getAllQuestions = async(collection) => {
    return await collection.find({}).toArray();
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