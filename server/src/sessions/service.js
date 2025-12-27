const crypto = require('crypto');

/**
 * Generates a secure random session ID
 * @returns {string} 32-byte hexadecimal string
 */
const generateSessionId = () => {
    return crypto.randomBytes(32).toString('hex');
};

/**
 * Validates session ID format
 * @param {string} sessionId - Session ID to validate
 * @throws {Error} When session ID is invalid
 */
const validateSessionId = (sessionId) => {
    if (!sessionId || typeof sessionId !== 'string') {
        throw new Error('Valid session ID is required');
    }

    if (sessionId.length !== 64) {
        throw new Error('Invalid session ID format');
    }
};

/**
 * Validates user ID format
 * @param {string} userId - User ID to validate
 * @throws {Error} When user ID is invalid
 */
const validateUserId = (userId) => {
    if (!userId || typeof userId !== 'string') {
        throw new Error('Valid user ID is required');
    }
};

/**
 * Validates session creation request
 * @param {string|null} currentSessionId - Current session ID
 * @param {string} questionId - Question ID from query
 * @returns {boolean} Whether a new session should be created
 * @throws {Error} When validation fails
 */
const validateSessionCreation = (currentSessionId, questionId) => {

    if (currentSessionId && questionId !== '0') {
        return false; // Existing session is valid
    }

    return true; // Need to create new session
};

/**
 * Validates session save request
 * @param {string} sessionId - Session ID
 * @param {string} userId - User ID
 * @throws {Error} When validation fails
 */
const validateSessionSaveRequest = (sessionId, userId) => {
    validateSessionId(sessionId);
    validateUserId(userId);
};

/**
 * Prepares session data for database insertion
 * @param {string} sessionId - Session ID
 * @param {string} userId - User ID
 * @returns {Object} Prepared session data
 */
const prepareSessionData = (sessionId, userId) => {
    return {
        session_id: sessionId,
        user_id: userId,
        created_at: new Date()
    };
};

module.exports = {
    generateSessionId,
    validateSessionId,
    validateUserId,
    validateSessionCreation,
    validateSessionSaveRequest,
    prepareSessionData
};