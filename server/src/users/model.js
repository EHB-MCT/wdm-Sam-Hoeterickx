const bcrypt = require('bcrypt');

const findUserByEmail = async(collection, email) => {
    return await collection.findOne({ email: email});
}

const verifyPassword = async(password, hashedpassword) => {
    return await bcrypt.compare(password, hashedpassword);
}

module.exports = {
    findUserByEmail,
    verifyPassword
}