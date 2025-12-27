const bcrypt = require('bcrypt');

/**
 * Validates password strength according to requirements
 * @param {string} password - The password to validate
 * @throws {Error} When password doesn't meet requirements
 */
const validatePassword = (password) => {
    if (!password || password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        throw new Error('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        throw new Error('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        throw new Error('Password must contain at least one number');
    }
};

/**
 * Validates user registration data
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @param {string} userData.repeatPassword - Password confirmation
 * @throws {Error} When validation fails
 */
const validateRegistrationData = (userData) => {
    const { username, email, password, repeatPassword } = userData;

    if (!username || !email || !password || !repeatPassword) {
        throw new Error('Missing registration information');
    }

    if (password !== repeatPassword) {
        throw new Error("Passwords don't match");
    }

    validatePassword(password);
};

/**
 * Validates login credentials
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - Email address
 * @param {string} credentials.password - Password
 * @throws {Error} When validation fails
 */
const validateLoginCredentials = (credentials) => {
    const { email, password } = credentials;

    if (!email || !password) {
        throw new Error('Missing login information');
    }
};

/**
 * Hashes a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

/**
 * Verifies a password against its hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches
 */
const verifyPasswordHash = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

module.exports = {
    validatePassword,
    validateRegistrationData,
    validateLoginCredentials,
    hashPassword,
    verifyPasswordHash
};