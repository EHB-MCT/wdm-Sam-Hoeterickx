const bcrypt = require('bcrypt');

export const findUserByEmail = async(collection, email) => {
    return await collection.findOne({ email: email});
}

export const verifyPassword = async(password, hashedpassword) => {
    return await bcrypt.compare(password, hashedpassword);
}