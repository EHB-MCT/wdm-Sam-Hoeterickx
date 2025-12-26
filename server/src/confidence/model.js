const saveConfidence = (collection, confidenceData) => {
    return collection.insertOne({
        session_id: confidenceData.SESSION_ID,
        isConfidence: confidenceData.isConfidence,
        elapsed_hover_time: confidenceData.elapsed_hover_time,
        decision_time: confidenceData.decision_time,
        createdAt: new Date()
    });
}

module.exports = {
    saveConfidence
}