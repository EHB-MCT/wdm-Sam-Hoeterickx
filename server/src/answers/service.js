/**
 * Validates answer data structure
 * @param {Object} answerData - Answer data to validate
 * @param {string} answerData.session_id - Session ID
 * @param {string} answerData.question_id - Question ID
 * @param {string} answerData.selected_answer - Selected answer
 * @param {number} answerData.decision_time - Time taken to make decision
 * @param {Object} answerData.elapsed_hover_time - Hover time data
 * @param {Object} answerData.changed_mind - Changed mind data
 * @throws {Error} When validation fails
 */
const validateAnswerData = (answerData) => {
    const { session_id, question_id, selected_answer, decision_time, elapsed_hover_time, changed_mind } = answerData;

    if (!session_id) {
        throw new Error('Session ID is required');
    }

    if (!question_id) {
        throw new Error('Question ID is required');
    }

    if (selected_answer === undefined) {
        throw new Error('Selected answer is required');
    }

    if (typeof decision_time !== 'number' || decision_time <= 0) {
        throw new Error('Decision time must be a positive number');
    }

    if (!elapsed_hover_time || typeof elapsed_hover_time !== 'object') {
        throw new Error('Elapsed hover time is required and must be an object');
    }

    if (!changed_mind || typeof changed_mind !== 'object') {
        throw new Error('Changed mind data is required and must be an object');
    }
};

/**
 * Prepares answer data for database insertion
 * @param {Object} answerData - Raw answer data
 * @returns {Object} Prepared answer data with timestamp
 */
const prepareAnswerData = (answerData) => {
    return {
        session_id: answerData.session_id,
        question_id: answerData.question_id,
        selected_answer: answerData.selected_answer,
        decision_time: answerData.decision_time,
        elapsed_hover_time: answerData.elapsed_hover_time,
        changed_mind: answerData.changed_mind,
        created_at: new Date()
    };
};

/**
 * Validates session existence for answer
 * @param {string} sessionId - Session ID to validate
 * @throws {Error} When session ID is invalid
 */
const validateSessionForAnswer = (sessionId) => {
    if (!sessionId || typeof sessionId !== 'string') {
        throw new Error('Valid session ID is required');
    }
};

module.exports = {
    validateAnswerData,
    prepareAnswerData,
    validateSessionForAnswer
};