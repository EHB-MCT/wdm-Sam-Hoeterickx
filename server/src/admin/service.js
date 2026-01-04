const { getAllStats } = require('./model');
const { findUserById, findAllUsers } = require('../users/model'); 

/**
 * Check if user has admin access
 * @param {Object} user - User object
 * @returns {Promise<boolean>} True if user has admin access
 */
const checkAdminAccess = async (user) => {
    return user && user.role === 'admin';
};

/**
 * Authenticate admin user by ID
 * @param {Object} userCollection - User collection
 * @param {string} userId - User ID to authenticate
 * @returns {Promise<Object>} User object with admin privileges
 */
const authenticateAdmin = async (userCollection, userId) => {
    const user = await findUserById(userCollection, userId);
    
    if (!user) {
        throw new Error('User not found');
    }
    
    if (user.role !== 'admin') {
        throw new Error('Admin access required');
    }
    
    return user;
};

/**
 * Get all users from database
 * @param {Object} userCollection - User collection
 * @returns {Promise<Array>} Array of all users
 */
const getAllUsers = async (userCollection) => {
    return await findAllUsers(userCollection);
};

/**
 * Get dashboard statistics
 * @param {Object} collections - All database collections
 * @returns {Promise<Object>} Statistics object
 */
const getDashboardStats = async (collections) => {
    return await getAllStats(collections);
};

module.exports = {
    checkAdminAccess,
    authenticateAdmin,
    getAllUsers,
    getDashboardStats
};