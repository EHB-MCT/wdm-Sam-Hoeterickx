const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

/**
 * Find user in database by email adress
 * 
 * @param {Object} collection - User collection
 * @param {String} email - email adress of the user
 * @returns 
 */
const findUserByEmail = async(collection, email) => {
    return await collection.findOne({ email: email});
}

/**
 * Find user in database by their _id
 * 
 * @param {Object} collection - User collection
 * @param {String} USER_ID - id of the user
 * @returns 
 */
const findUserById = async(collection, USER_ID) => {
    return await collection.findOne(
        { _id: new ObjectId(USER_ID) },
        { projection: { username: 1, email: 1 } }
    );
}

/**
 * Verify password
 * Compares plain text password with a bcrypt hash
 * 
 * @param {String} password - Plain password from input
 * @param {String} hashedpassword - Hashed pasword from the database
 * @returns 
 */
const verifyPassword = async(password, hashedpassword) => {
    return await bcrypt.compare(password, hashedpassword);
}

/**
 * Create a new user in the database
 * - Hashes the password
 * 
 * @param {Object} collection - User collection
 * @param {Object} userData - Object containing username, email, and password
 * @returns 
 */
const registerNewUser = async(collection, userData) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        created_at: new Date()
    };

    const result = await collection.insertOne(newUser);
    
    newUser._id = result.insertedId;

    return {result, newUser};
}

module.exports = {
    findUserByEmail,
    verifyPassword,
    registerNewUser,
    findUserById
}