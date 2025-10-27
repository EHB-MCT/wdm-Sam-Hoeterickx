const savePredictionChangedMind = async(collection, sessionId, changedMindState) => {
    const result = await collection.insertOne({
        sessionId: sessionId,
        changedMind: changedMindState,
        created_at: new Date()
    })

    return result
}

module.exports = {
    savePredictionChangedMind
}