const getAllQuestions = async(collection) => {
    return await collection.find({}).toArray();
}

module.exports = {
    getAllQuestions
}