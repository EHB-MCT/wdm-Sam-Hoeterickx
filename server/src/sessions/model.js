const crypto = require('crypto');

const generateSessionId = () => {
    return crypto.randomBytes(32).toString('hex');
} 

module.exports = {
    generateSessionId
}