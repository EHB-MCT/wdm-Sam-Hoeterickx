const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

/**
 * Find user in database by email address
 * @param {Object} collection - User collection
 * @param {string} email - Email address of the user
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findUserByEmail = async(collection, email) => {
    return await collection.findOne(
        { email: email },
        { projection: { username: 1, email: 1, role: 1, password: 1 }}
    );
};

/**
 * Find user in database by their _id
 * @param {Object} collection - User collection
 * @param {string} userId - ID of the user
 * @returns {Promise<Object|null>} User object with username and email or null if not found
 */
const findUserById = async(collection, userId) => {
    return await collection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { username: 1, email: 1, role: 1 } }
    );
};

/**
 * Verify password
 * Compares plain text password with a bcrypt hash
 * @param {string} password - Plain password from input
 * @param {string} hashedPassword - Hashed password from the database
 * @returns {Promise<boolean>} True if password matches
 * @throws {Error} When password comparison fails
 */
const verifyPassword = async(password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

/**
 * Create a new user in the database
 * @param {Object} collection - User collection
 * @param {Object} userData - Object containing username, email, and password
 * @param {string} userData.username - Username of the user
 * @param {string} userData.email - Email address of the user
 * @param {string} userData.password - Plain text password
 * @returns {Promise<Object>} Object containing result and newUser
 * @throws {Error} When user creation fails
 */
const registerNewUser = async(collection, userData) => {
    const { hashPassword } = require('./service');
    const hashedPassword = await hashPassword(userData.password);

    const newUser = {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: 'user',
        created_at: new Date()
    };

    const result = await collection.insertOne(newUser);
    
    newUser._id = result.insertedId;

    return { result, newUser };
};

/**
 * Get all users from database
 * @param {Object} userCollection - User collection
 * @returns {Promise<Array>} Array of all users
 */
const findAllUsers = async(userCollection) => {
    try {
        return await userCollection.find({}).toArray();
    } catch (error) {
        console.error('Error finding all users:', error);
        throw new Error('Failed to retrieve users');
    }
};

/**
 * Get all user IDs from database
 * @param {Object} userCollection - User collection
 * @returns {Promise<Array>} Array of user ID strings
 */
const findAllUsersIds = async(userCollection) => {
    try {
        const userIdObjects = await userCollection.find(
            {},
            { projection: {_id: 1} }
        ).toArray();
        
        // Convert ObjectId array to string array
        const userIdList = userIdObjects.map(user => user._id.toString());
        
        return userIdList;
    } catch (error) {
        console.error('Error finding all users:', error);
        throw new Error('Failed to retrieve users');
    }
};

module.exports = {
    findUserByEmail,
    verifyPassword,
    registerNewUser,
    findUserById,
    findAllUsers,
    findAllUsersIds,
}