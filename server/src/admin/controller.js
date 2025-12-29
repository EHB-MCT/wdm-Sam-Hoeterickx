const adminService = require("./service");
const { getAllAnswers } = require('../answers/model.js');
const { findAllBrowserSessions } = require('../browser/model.js');
const { getAllLocations } = require('../geoLocation/model.js');
const { getAllQuestions } = require('../questions/model.js');
const { findAllUsersIds, findAllUsers } = require('../users/model.js');
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
        return res.status(403).json({
            status: 403,
            message: error.message,
            isLoggedIn: false,
            data: null
        });
    }
};

const collectAllData = async(req, res, collections) => {
    try{
        const USER_ID = req.signedCookies.user;
        console.log(USER_ID)

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

const collectAllDataFromUsers = async(req, res, collections) => {
    try{

        console.log(req)
        const SESSION_ID = req.signedCookies.session;
        const USER_ID = req.signedCookies.user;

        console.log(USER_ID);

        // const { SESSION_ID, USER_ID} = req.body;

        if (!USER_ID) {
            return res.status(401).json({
                status: 401,
                message: 'Authentication required',
                isLoggedIn: false,
                data: null
            });
        }

        if(!SESSION_ID){
            return res.status(422).json({
                status: 422,
                message: 'Missing sessions cookie'
            });
        }

        const admin = await adminService.authenticateAdmin(collections.users, USER_ID);
        if(!admin){
            return res.status(403).json({
                status: 403,
                message: 'Unauthorized user',
            });
        }

        const userIdList = await findAllUsersIds(collections.users);
        console.log('User ID List:', userIdList);

        return res.status(200).json({
            status: 200,
            message: 'User IDs retrieved successfully',
            data: userIdList
        });

    }catch(error){
        console.error('Error while getting al the data:', error);
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
}

const collectAllSessionsPerUser = async(req, res, collections) => {
    try {

        const USER_ID = req.signedCookies.user;
        console.log(USER_ID)

        if (!USER_ID) {
            return res.status(401).json({
                status: 401,
                message: 'Authentication required',
                isLoggedIn: false,
                data: null
            });
        }

        const admin = await adminService.authenticateAdmin(collections.users, USER_ID);
        console.log(admin)
        if(!admin){
            return res.status(403).json({
                status: 403,
                message: 'Unauthorized user',
            });
        }

        // Get all users, sessions, and related data
        const [users, sessions, browserData, locations, answers, questions] = await Promise.all([
            findAllUsers(collections.users),
            findAllSessions(collections.sessions),
            findAllBrowserSessions(collections.browser),
            getAllLocations(collections.geoLocation),
            getAllAnswers(collections.answers),
            getAllQuestions(collections.questions)
        ]);



        // Group sessions by user
        const userSessionsList = users.map(user => {
            const userId = user._id.toString();
            
            // Find sessions that actually belong to this user
            const userRelatedSessions = sessions
                .filter(session => session.user_id && session.user_id.toString() === userId)
                .map(session => {
                    const sessionId = session.session_id;

                    // Find matching browser data
                    const browserInfo = browserData.find(b => b.session_id === sessionId) || {};
                    
                    // Find matching location data
                    const locationData = locations.filter(l => 
                        l.sessionId === sessionId || 
                        l.session_id === sessionId ||
                        (l.session && l.session.id === sessionId)
                    );
                    
                    // Find matching answers
                    const answerData = answers.filter(a => a.session_id === sessionId);

                // Process answers to get question details
                const processedAnswers = answerData.map(answer => {
                    const answerObj = answer.toObject ? answer.toObject() : answer;
                    
                    // Use correct field names based on the data models
                    const question = questions.find(q => q._id.toString() === answer.question_id.toString());
                    
                    return {
                        ...answerObj,
                        question: question || null,
                        questionText: question ? question.question : `Unknown question (ID: ${answer.question_id})`,
                        selected_option: answer.selected_answer || 'No option selected'
                    };
                });

                // Calculate session analytics

                const confidenceScores = answerData
                    .filter(a => a.confidence_score)
                    .map(a => a.confidence_score);
                
                const avgConfidence = confidenceScores.length > 0
                    ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
                    : null;

                return {
                    sessionId,
                    platform: browserInfo.platform || 'Unknown',
                    browser: browserInfo.brand ? 
                        `${browserInfo.brand.brand} ${browserInfo.brand.version || ''}` : 
                        'Unknown',
                    deviceType: browserInfo.mobile ? 'Mobile' : 'Desktop',
                    userAgent: browserInfo.userAgent || 'Unknown',
                    
                    // Browser extensions
                    extensions: browserInfo.extensions || [],
                    
                    // Location data
                    locations: locationData,
                    
                    // Answer analytics
                    answerCount: answerData.length,
                    answers: processedAnswers,
                    avgConfidence: avgConfidence ? Number(avgConfidence.toFixed(1)) : null,
                    
                    // Raw data for technical view
                    rawBrowser: browserInfo.toObject ? browserInfo.toObject() : browserInfo,
                    
                    // Additional metrics
                    hasGeoData: locationData.length > 0,
                    hasAnswers: answerData.length > 0
                };
            });

            // Return user info with all sessions
            return {
                userId,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.created_at,
                sessions: userRelatedSessions,
                totalSessions: userRelatedSessions.length,
                totalAnswers: userRelatedSessions.reduce((sum, session) => sum + session.answerCount, 0),
                totalLocations: userRelatedSessions.reduce((sum, session) => sum + session.locationCount, 0)
            };
        });

        // Filter out users with no sessions
        const usersWithSessions = userSessionsList.filter(user => user.sessions.length > 0);

        return res.status(200).json({
            status: 200,
            message: 'User sessions retrieved successfully',
            data: {
                usersWithSessions,
                totalUsers: usersWithSessions.length,
                totalSessions: usersWithSessions.reduce((sum, user) => sum + user.totalSessions, 0)
            }
        });

    } catch (error) {
        console.error('Error while collecting sessions per user:', error);
        return res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
}

module.exports = {
    authenticateAdmin,
    collectAllData,
    collectAllDataFromUsers,
    collectAllSessionsPerUser
}