const { findAllAnswerWithSessionId } = require('../answers/model');
const { findAllConfidencesWithSessionId } = require('../confidence/model');
const { findSessionIdsOfUser } = require('../sessions/model');
const {
    findUserByEmail,
    registerNewUser,
    findUserById
} = require('./model');
const {
    validateLoginCredentials,
    validateRegistrationData,
    verifyPasswordHash
} = require('./service');

/**
 * Login user and set user cookie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} userCollection - User collection
 * @param {string} req.body.email - Email adress of the user
 * @param {string} req.body.password - Password of the user
 */
const loginUser = async(req, res, userCollection) => {
    try {
        const USER_ID = req.signedCookies.user;
        
        if (USER_ID) {
            return res.status(200).json({
                status: 200,
                message: 'Login Successful'
            });
        }

        const { email, password } = req.body;

        validateLoginCredentials({ email, password });

        const user = await findUserByEmail(userCollection, email);
        
        if (!user) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid credentials'
            });
        }

        const passwordMatch = await verifyPasswordHash(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid credentials'
            });
        }

        const userIdString = user._id.toString();

        res.cookie('user', userIdString, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            signed: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            status: 200,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Error with login:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
} 

/**
 * Register user and set user cookie
 * Password Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} userCollection - User collection
 * @param {string} req.body.username - Username of the user
 * @param {string} req.body.email - Email adress of the user
 * @param {string} req.body.password - Password of the user
 * @param {string} req.body.repeatPassword - Password of the user
 * @param {Object} userCollection - User collection
 */
const registerUser = async(req, res, userCollection) => {
    try {
        const { username, email, password, repeatPassword } = req.body;
        const userData = {
            username,
            email,
            password,
            repeatPassword
        };

        validateRegistrationData(userData);

        const existingUser = await findUserByEmail(userCollection, email);
        if (existingUser) {
            return res.status(409).json({
                status: 409,
                message: "Email already in use"
            });
        }

        const newUser = await registerNewUser(userCollection, userData);

        if (!newUser.newUser._id) {
            return res.status(401).json({
                status: 401,
                message: "Error while creating account"
            });
        }

        const userIdString = newUser.newUser._id.toString();

        res.cookie('user', userIdString, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            signed: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            status: 201,
            message: "Account created successfully"
        });

    } catch (error) {
        console.error('Error with registration:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}

/**
 * Log out user and removes user cookie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logoutUser = (req, res) => {
    try {
        res.clearCookie('user');

        return res.status(200).json({ 
            message: 'Logged out successfully' 
        });

    } catch (error) {
        console.error('Error with logout:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}

/**
 * Get info of the user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} userCollection - User collection
 * @param {Object} answerCollection - Answer collection
 * @param {Object} sessionCollection - Session collection
 * @param {Object} confidenceCollection - Confidence collection
 */
const getUserInfo = async(req, res, userCollection, answerCollection, sessionCollection, confidenceCollection) => {
    try {
        const USER_ID = req.signedCookies.user;
        const SESSION_ID = req.signedCookies.session;

        if (!USER_ID || !SESSION_ID) {
            return res.status(422).json({
                status: 422,
                message: 'Missing credentials'
            });
        }

        const user = await findUserById(userCollection, USER_ID);
        const userSessions = await findSessionIdsOfUser(sessionCollection, USER_ID);
        const sessionIdList = userSessions.map(session => session.session_id);
        const answers = await findAllAnswerWithSessionId(answerCollection, sessionIdList);
        const confidenceData = await findAllConfidencesWithSessionId(confidenceCollection, sessionIdList);

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Successful',
            data: {
                user,
                userSessions,
                answers,
                confidenceData
            }
        });
        
    } catch (error) {
        console.error('Error with getting user info:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}

/**
 * Check if user is currently authenticated with the user cookie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} userCollection - User collection
 */
const authenticateUser = async(req, res, userCollection) => {
    try {
        const USER_ID = req.signedCookies.user;

        if (!USER_ID) {
            return res.status(200).json({
                status: 200,
                message: 'Authorization failed',
                isLoggedIn: false,
                data: null
            });
        }

        const user = await findUserById(userCollection, USER_ID);

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Authentication successful',
            isLoggedIn: true,
            data: user
        });

    } catch (error) {
        console.error('Error while authenticating user:', error);
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
}

module.exports = {
    loginUser,
    registerUser,
    logoutUser,
    getUserInfo,
    authenticateUser
};