const adminService = require("./service");

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

module.exports = {
    authenticateAdmin
}