const { findUserById } = require('../users/model.js');
const { saveSessionId, findSessionById, addUserToSessionId } = require('./model.js');
const { 
    generateSessionId,
    validateSessionCreation, 
    prepareSessionData, 
    validateSessionSaveRequest 
} = require('./service.js');

/**
 * Create a new session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} sessionCollection - Session collection
 */
const createSessionId = async (req, res, sessionCollection) => {
    try {
        const userId = req.signedCookies.user || null;
        const currentSessionId = req.signedCookies.session;
        const questionId = req.query.q;

        const shouldCreateNewSession = validateSessionCreation(currentSessionId, questionId);
        
        if (!shouldCreateNewSession) {
            return res.status(200).json({
                status: 200,
                message: 'Session already exists',
                sessionId: currentSessionId
            });
        }

        const sessionId = generateSessionId();
        if (!sessionId) {
            return res.status(500).json({
                status: 500,
                message: 'Failed to create session ID'
            });
        }

        const sessionData = prepareSessionData(sessionId, userId);
        const result = await saveSessionId(sessionCollection, sessionId, userId);
        
        if (!result) {
            return res.status(500).json({
                status: 500,
                message: 'Failed to save session ID'
            });
        }

        res.cookie('session', sessionId, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            signed: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            status: 201,
            message: 'Session created successfully',
            sessionId: sessionId
        });

    } catch (error) {
        console.error('Session ID creation error:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}

/**
 * Save current session to authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} sessionCollection - Session collection
 * @param {Object} userCollection - User collection
 */
const saveSessionToUser = async (req, res, sessionCollection, userCollection) => {
    try {
        const sessionId = req.signedCookies.session;
        const userId = req.signedCookies.user;

        validateSessionSaveRequest(sessionId, userId);

        const existingSession = await findSessionById(sessionCollection, sessionId);
        if (!existingSession) {
            return res.status(404).json({
                status: 404,
                message: 'Session not found'
            });
        }

        const existingUser = await findUserById(userCollection, userId);
        if (!existingUser) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }

        const savedSessionToUser = await addUserToSessionId(sessionCollection, sessionId, userId);
        
        if (!savedSessionToUser) {
            return res.status(500).json({
                status: 500,
                message: 'Failed to save session to user'
            });
        }

        return res.status(204).json({
            status: 204,
            message: 'Session saved successfully to User'
        });

    } catch (error) {
        console.error('Error while saving session to user:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}

/**
 * Read session cookie for debugging
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const readCookie = (req, res) => {
    try {
        const sessionId = req.signedCookies.session;
        console.log('Session ID from cookie:', sessionId);

        return res.status(200).json({
            status: 200,
            message: "Session cookie read successfully",
            sessionId: sessionId || null
        });
    } catch (error) {
        console.error('Error reading cookie:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}


module.exports = {
    createSessionId,
    saveSessionToUser,
    readCookie
}