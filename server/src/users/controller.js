const { findAllAnswerWithSessionId } = require('../answers/model');
const { findAllConfidencesWithSessionId } = require('../confidence/model');
const { findSessionIdsOfUser } = require('../sessions/model');
const {
    findUserByEmail,
    verifyPassword,
    registerNewUser,
    findUserById
} = require('./model');


/**
 * Login user and set user cookie
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} collection - User collection
 * @param {string} req.body.email - Email adress of the user
 * @param {string} req.body.password - Password of the user
 * @returns 
 */
const loginUser = async(req, res, collection) => {
    try{

        const USER_ID = req.signedCookies.user;
        const {email, password} = req.body;
        console.log('login')

        if(USER_ID){
            return res.status(200).send({
                status: 200,
                message: 'Login Successful',
            });
        };

        if(!email || !password){
            return res.status(422).send({
                status: 422,
                message: 'Missing login info',
            });
        };

        const user = await findUserByEmail(collection, email);
        
        if(!user){
            return res.status(401).send({
                status: 401,
                message: 'Invalid credentials',
            });
        };

        const passwordMatch = await verifyPassword(password, user.password);

        if(!passwordMatch){
            return res.status(401).send({
                status: 401,
                message: 'Invalid credentials',
            });
        };

        const userIdString = user._id.toString();

        res.cookie('user', userIdString, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, 
            signed: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        console.log('Cookie set:', userIdString);

        return res.status(200).send({
            status: 200,
            message: 'Login succesfull',
        });

    }catch(error){
        console.error('Error whith login', error);
        return res.status(500).send({
            status: 500,
            message: error.message
        });
    }
} 

/**
 * Register user and set user cookie
 * * Password Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} collection - User collection
 * @param {string} req.body.username - Username of the user
 * @param {string} req.body.email - Email adress of the user
 * @param {string} req.body.password - Password of the user
 * @param {string} req.body.repeatPassword - Password of the user
 * @returns 
 */
const registerUser = async(req, res, collection) => {
    try{
        const { username, email, password, repeatPassword } = req.body;
        const userData = {
            username,
            email,
            password,
            repeatPassword
        }

        if(!username || !email || !password || !repeatPassword){
            return res.status(422).send({
                status: 422,
                message: "Missing register info"
            });
        }

        if (password.length < 8) {
            return res.status(422).send({
                status: 422,
                message: "Password must be at least 8 characters long"
            });
        }

        if (!/[A-Z]/.test(password)) {
            return res.status(422).send({
                status: 422,
                message: "Password must contain at least one uppercase letter"
            });
        }

        if (!/[a-z]/.test(password)) {
            return res.status(422).send({
                status: 422,
                message: "Password must contain at least one lowercase letter"
            });
        }

        if (!/[0-9]/.test(password)) {
            return res.status(422).send({
                status: 422,
                message: "Password must contain at least one number"
            });
        }

        if(password !== repeatPassword){
            return res.status(401).send({
                status: 401,
                message: "Passwords don't match"
            })
        }

        const user = await findUserByEmail(collection, email);
        if(user){
            return res.status(409).send({
                status: 409,
                message: "Email already in use"
            })         
        }

        const newUser = await registerNewUser(collection, userData);

        if(!newUser.newUser._id) {
            return res.status(401).send({
                status: 401,
                message: "Error while creating account"
            });
        };

        const userIdString = newUser.newUser._id.toString();

        res.cookie('user', userIdString, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false, 
            signed: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).send({
            status: 201,
            message: "Account created succesfully",
        });

    }catch(error){
        console.error('Error whith login', error);
        return res.status(500).send({
            status: 500,
            message: error.message,
        });
    }
}

/**
 * Log out user and removes user cookie
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns 
 */
const logoutUser = (req, res) => {
    try{
        res.clearCookie('user');

        res.status(200).send({ message: 'Logged out successfully' });

    }catch(error){
        console.error('Error whith logout', error);
        return res.status(500).send({
            status: 500,
            message: error.message,
        });
    }
}

/**
 * Get info of the user
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} userCollection - User collection
 * @param {Object} answerCollection - Answer collection
 * @param {Object} sessionCollection - Session collection
 * @param {Object} confidenceCollection - Confidence collection
 * @returns 
 */
const getUserInfo = async(req, res, userCollection, answerCollection, sessionCollection, confidenceCollection) => {
    try{

        const USER_ID = req.signedCookies.user;
        const SESSION_ID = req.signedCookies.session;

        if(!USER_ID || !SESSION_ID){
            return res.status(422).send({
                status: 422,
                message: 'Missing credentials'
            });
        };

        const user = await findUserById(userCollection, USER_ID);
        const userSessions = await findSessionIdsOfUser(sessionCollection, USER_ID);
        const sessionIdList = userSessions.map(session => session.session_id);
        const answers = await findAllAnswerWithSessionId(answerCollection, sessionIdList);
        const confidenceData = await findAllConfidencesWithSessionId(confidenceCollection, sessionIdList);

        if(!user){
            return res.status(404).send({
                status: 404,
                message: 'User not found'
            })
        }

        return res.status(200).send({
            status: 200,
            message: 'Successful',
            data: {
                user,
                userSessions,
                answers,
                confidenceData
            }
        })
        
    }catch(error){
        console.error('Error whith getting user info', error);
        return res.status(500).send({
            status: 500,
            message: error.message,
        });
    }
}

/**
 * Check if user is currently authenticated with the user cookie
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Object} collection - User collection
 * @returns 
 */
const authenticateUser = async(req, res, collection) => {
    try{
        console.log('START AUTH USER')

        const USER_ID = req.signedCookies.user;

        console.log(USER_ID)

        if(!USER_ID){
            return res.status(200).send({
                status: 200,
                message: 'Authorization failed',
                isLoggedIn: false,
                data: null
            });
        }

        const user = await findUserById(collection, USER_ID);

        if(!user){
            return res.status(404).send({
                status: 404,
                message: 'User not found'
            });
        };

        return res.status(200).send({
            status: 200,
            message: 'Authentication successfull',
            isLoggedIn: false,
            data: user
        });

    }catch(error){
        console.error('Error while authenticating user', error);
        return res.status(500).send({
            status: 500,
            message: error.message
        });
    };
}

module.exports = {
    loginUser,
    registerUser,
    logoutUser,
    getUserInfo,
    authenticateUser
};