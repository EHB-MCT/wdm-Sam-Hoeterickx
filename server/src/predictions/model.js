const savePredictionData = async(collection, sessionId, changedMindState, elapsedHoverTime, desicionTime) => {
    const result = await collection.insertOne({
        sessionId: sessionId,
        changedMind: changedMindState,
        elapsedHoverTime: elapsedHoverTime,
        desicionTime: desicionTime,
        created_at: new Date()
    })

    return result
}

module.exports = {
    savePredictionData
}