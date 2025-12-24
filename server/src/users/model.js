const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const findUserByEmail = async(collection, email) => {
    return await collection.findOne({ email: email});
}

const findUserById = async(collection, userId) => {
    return await collection.findOne(
        { _id: new ObjectId(userId) },
        { projection: { username: 1, email: 1 } }
    );
}

const verifyPassword = async(password, hashedpassword) => {
    return await bcrypt.compare(password, hashedpassword);
}

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