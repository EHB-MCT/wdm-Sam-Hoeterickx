/**
 * Inserts new session in the database
 * @param {Object} collection - Session collection
 * @param {string} sessionId - Session ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} MongoDB insert result
 * @throws {Error} When insertion fails
 */
const saveSessionId = async (collection, sessionId, userId) => {
    return await collection.insertOne({
        session_id: sessionId,
        user_id: userId,
        created_at: new Date()
    });
};

/**
 * Find session with session ID
 * @param {Object} collection - Session collection
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object|null>} Session document or null if not found
 * @throws {Error} When database query fails
 */
const findSessionById = async (collection, sessionId) => {
    return await collection.findOne({ session_id: sessionId });
};

/**
 * Add authenticated user ID to current session
 * @param {Object} collection - Session collection
 * @param {string} sessionId - Session ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Updated session document or null if not found
 * @throws {Error} When update fails
 */
const addUserToSessionId = async(collection, sessionId, userId) => {
    return await collection.findOneAndUpdate(
        { session_id: sessionId },
        {
            $set: {
                user_id: userId
            }
        },
        { returnDocument: 'after' }
    );
};

/**
 * Find all sessions for authenticated user
 * @param {Object} collection - Session collection
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of session documents with only session_id field
 * @throws {Error} When database query fails
 */
const findSessionIdsOfUser = async(collection, userId) => {
    return await collection.find(
        { user_id: userId },
        { projection: { session_id: 1, _id: 0 }}
    ).toArray();
};

/**
 * Find all sessions in the collection
 * @param {Object} collection - Session collection
 * @returns {Promise<Array>} Array of all session documents
 * @throws {Error} When database query fails
 */
const findAllSessions = async (collection) => {
    return await collection.find({}).toArray();
};

module.exports = {
    saveSessionId,
    findSessionIdsOfUser,
    findSessionById,
    addUserToSessionId,
    findAllSessions
}