/**
 * Validates confidence data structure
 * @param {Object} confidenceData - Confidence data to validate
 * @param {string} confidenceData.session_id - Session ID
 * @param {boolean} confidenceData.isConfidence - Confidence state
 * @param {number} confidenceData.decision_time - Time taken for decision
 * @param {Object} confidenceData.elapsed_hover_time - Hover time data
 * @throws {Error} When validation fails
 */
const validateConfidenceData = (confidenceData) => {
    const { session_id, isConfidence, decision_time, elapsed_hover_time } = confidenceData;

    if (!session_id) {
        throw new Error('Session ID is required');
    }

    if (typeof isConfidence !== 'boolean') {
        throw new Error('Confidence state must be a boolean');
    }

    if (typeof decision_time !== 'number' || decision_time <= 0) {
        throw new Error('Decision time must be a positive number');
    }

    if (!elapsed_hover_time || typeof elapsed_hover_time !== 'object') {
        throw new Error('Elapsed hover time is required and must be an object');
    }
};

/**
 * Prepares confidence data for database insertion
 * @param {Object} rawConfidenceData - Raw confidence data from request
 * @param {string} sessionId - Session ID
 * @returns {Object} Prepared confidence data with timestamp
 */
const prepareConfidenceData = (rawConfidenceData, sessionId) => {
    const { changed_mind_state, elapsed_hover_time, decision_time } = rawConfidenceData;
    
    return {
        session_id: sessionId,
        isConfidence: !changed_mind_state,
        elapsed_hover_time,
        decision_time,
        created_at: new Date()
    };
};

/**
 * Validates raw confidence request data
 * @param {Object} requestData - Request body data
 * @param {boolean} requestData.changed_mind_state - Whether mind was changed
 * @param {Object} requestData.elapsed_hover_time - Hover time data
 * @param {number} requestData.decision_time - Decision time
 * @throws {Error} When validation fails
 */
const validateConfidenceRequestData = (requestData) => {
    const { changed_mind_state, elapsed_hover_time, decision_time } = requestData;

    if (changed_mind_state === undefined) {
        throw new Error('Changed mind state is required');
    }

    if (typeof changed_mind_state !== 'boolean') {
        throw new Error('Changed mind state must be a boolean');
    }

    if (!elapsed_hover_time || typeof elapsed_hover_time !== 'object') {
        throw new Error('Elapsed hover time is required and must be an object');
    }

    if (typeof decision_time !== 'number' || decision_time <= 0) {
        throw new Error('Decision time must be a positive number');
    }
};

/**
 * Validates session for confidence check
 * @param {string} sessionId - Session ID to validate
 * @throws {Error} When session ID is invalid
 */
const validateSessionForConfidence = (sessionId) => {
    if (!sessionId || typeof sessionId !== 'string') {
        throw new Error('Valid session ID is required');
    }
};

module.exports = {
    validateConfidenceData,
    prepareConfidenceData,
    validateConfidenceRequestData,
    validateSessionForConfidence
};