const crypto = require('crypto');
const { ObjectId, ReturnDocument } = require('mongodb');

const generateSessionId = () => {
    return crypto.randomBytes(32).toString('hex');
} 

const saveSessionId = async (collection, SESSION_ID, USER_ID) => {
    const result = await collection.insertOne({
        sessionId: SESSION_ID,
        user_id: USER_ID,
        created_at: new Date()
    });

    return result
} 

const addUserToSessionId = async(collection, SESSION_ID, USER_ID) => {
    return await collection.updadateOne(
        { _id: new ObjectId(SESSION_ID) },
        {
            $set: {
                userId: USER_ID
            }
        },
        { ReturnDocument: 'after' }
    )
}

const findSessionIdsOfUser = async(collection, USER_ID) => {
    return await collection.find(
        { user_id: USER_ID },
        { projection: { sessionId: 1, _id: 0 }}
    ).toArray();
}

module.exports = {
    generateSessionId,
    saveSessionId,
    findSessionIdsOfUser,
    addUserToSessionId
}