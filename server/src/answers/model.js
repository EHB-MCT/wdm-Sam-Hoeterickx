const saveAnswer = async(collection, SESSION_ID, question_id, selected_answer, decision_time, elapsed_hover_time, changed_mind) => {
    const result = await collection.insertOne({
        session_id: SESSION_ID,
        question_id: parseInt(question_id),
        selected_answer: selected_answer,
        decision_time: decision_time,
        elapsed_hover_time: elapsed_hover_time,
        changed_mind: changed_mind,
        created_at: new Date()
    });

    return result
}

const findAllAnswerWithSessionId = async (collection, SESSION_ID) => {
    const result = await collection.find({
        session_id: SESSION_ID
    }).toArray();

    return result
}

module.exports = {
    saveAnswer,
    findAllAnswerWithSessionId
}