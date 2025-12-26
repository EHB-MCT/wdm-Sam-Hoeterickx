const crypto = require('crypto');

/**
 * Generate a random crypot hex string of 32 bytes
 * 
 * @returns 
 */
const generateSessionId = () => {
    return crypto.randomBytes(32).toString('hex');
} 

/**
 * Inserts new session id in the database
 * 
 * @param {Object} collection - Session collection
 * @param {String} USER_ID - Cookie of user id
 * @param {String} SESSION_ID - Cookie of session id
 * @returns 
 */
const saveSessionId = async (collection, SESSION_ID, USER_ID) => {
    return await collection.insertOne({
        session_id: SESSION_ID,
        user_id: USER_ID,
        created_at: new Date()
    });
} 

/**
 * Find session with session id
 * 
 * @param {Object} collection - Session collection
 * @param {String} SESSION_ID - Cookie of session id
 * @returns 
 */
const findSessionById = async (collection, SESSION_ID) => {
    return collection.findOne({ session_id: SESSION_ID });
}

/**
 * Add authenticated user_id to current session
 * 
 * @param {Object} collection - Session collection
 * @param {String} USER_ID - Cookie of user id
 * @param {String} SESSION_ID - Cookie of session id
 * @returns 
 */
const addUserToSessionId = async(collection, SESSION_ID, USER_ID) => {
    return await collection.findOneAndUpdate(
        { session_id: SESSION_ID },
        {
            $set: {
                user_id: USER_ID
            }
        },
        { returnDocument: 'after' }
    )
}

/**
 * Find all sessions with id of authenticated user
 * 
 * @param {Object} collection - Session collection
 * @param {String} USER_ID - Cookie of user id
 * @returns 
 */
const findSessionIdsOfUser = async(collection, USER_ID) => {
    return await collection.find(
        { user_id: USER_ID },
        { projection: { session_id: 1, _id: 0 }}
    ).toArray();
}

module.exports = {
    generateSessionId,
    saveSessionId,
    findSessionIdsOfUser,
    findSessionById,
    addUserToSessionId
}