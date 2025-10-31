const savePredictionData = async(collection, sessionId, changed_mind_state, elapsed_hover_time, descion_time) => {
    const result = await collection.insertOne({
        sessionId: sessionId,
        changed_mind_state: changed_mind_state,
        elapsed_hover_time: elapsed_hover_time,
        descion_time: descion_time,
        created_at: new Date()
    })

    return result
}

module.exports = {
    savePredictionData
}