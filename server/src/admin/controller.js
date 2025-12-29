const adminService = require("./service");
const { getAllAnswers } = require('../answers/model.js');
const { findAllBrowserSessions } = require('../browser/model.js');
const { getAllLocations } = require('../geoLocation/model.js');
const { getAllQuestions } = require('../questions/model.js');
const { findAllUsers } = require('../users/model.js');
const { findAllSessions } = require('../sessions/model.js');

/**
 * Authenticate admin user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} userCollection - User collection
 */
const authenticateAdmin = async(req, res, userCollection) => {
    try {
        const USER_ID = req.signedCookies.user;

        if (!USER_ID) {
            return res.status(401).json({
                status: 401,
                message: 'Authentication required',
                isLoggedIn: false,
                data: null
            });
        }

        const result = await adminService.authenticateAdmin(userCollection, USER_ID);
        
        res.status(200).json({
            status: 200,
            message: 'Admin authentication successful',
            isLoggedIn: true,
            data: result
        });
    } catch (error) {
        console.error('Error while authenticating admin status:', error);
        res.status(403).json({
            status: 403,
            message: error.message,
            isLoggedIn: false,
            data: null
        });
    }
};

const collectAllData = async(req, res, collections) => {
    try{
        const { USER_ID } = req.body;

        if (!USER_ID) {
            return res.status(422).json({
                status: 422,
                message: 'Missing user ID',
            });
        }

        const admin = await adminService.authenticateAdmin(collections.users, USER_ID);
        if(!admin){
            return res.status(403).json({
                status: 403,
                message: 'Unauthorized user',
            });
        }

        // Collect all data from all collections
        const allUsers = await findAllUsers(collections.users);
        const allAnswers = await getAllAnswers(collections.answers);
        const allSessions = await findAllSessions(collections.sessions);
        const allBrowserData = await findAllBrowserSessions(collections.browser);
        const allConfidenceChecks = await getAllAnswers(collections.confidence);
        const allGeoLocationData = await getAllLocations(collections.geoLocation);
        const allQuestions = await getAllQuestions(collections.questions);

        res.status(200).json({
            status: 200,
            message: 'Collected project data successful',
            data: {
                users: allUsers,
                answers: allAnswers,
                sessions: allSessions,
                browserData: allBrowserData,
                confidenceData: allConfidenceChecks,
                geoLocationData: allGeoLocationData,
                questions: allQuestions,
                admin: admin
            }
        });

    }catch(error){
        console.error('Error while collecting all the project data:', error);
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
}

module.exports = {
    authenticateAdmin,
    collectAllData
}