const saveConfidence = async (collection, confidenceData) => {
    return await collection.insertOne({
        session_id: confidenceData.SESSION_ID,
        isConfidence: confidenceData.isConfidence,
        elapsed_hover_time: confidenceData.elapsed_hover_time,
        decision_time: confidenceData.decision_time,
        createdAt: new Date()
    });
}

const findAllConfidencesWithSessionId = async (collection, session_ids) => {
    return await collection.find({
        session_id: { $in: session_ids }
    }).toArray();
}

module.exports = {
    saveConfidence,
    findAllConfidencesWithSessionId
}