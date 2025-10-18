const crypto = require('crypto');

const generateSessionId = () => {
    return crypto.randomBytes(32).toString('hex');
} 

const saveSessionId = async (collection, SESSION_ID) => {
    const result = await collection.insertOne({
        sessionId: SESSION_ID,
        created_at: new Date()
    });

    return result
} 

module.exports = {
    generateSessionId,
    saveSessionId
}