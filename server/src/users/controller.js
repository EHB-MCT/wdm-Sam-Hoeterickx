const {
    findUserByEmail,
    verifyPassword
} = require('./model');

const loginUser = async(req, res, collection) => {
    try{

        const userId = req.signedCookies.user;
        const {email, password} = req.body;

        if(userId){
            return res.status(200).send({
                status: 200,
                message: 'Login Successful',
            });
        };

        if(!email || !password){
            return res.status(422).send({
                status: 422,
                message: 'Missing login info',
            });
        };

        const user = await findUserByEmail(collection, email);
        
        if(!user){
            return res.status(401).send({
                status: 401,
                message: 'Invalid credentials',
            });
        };

        
        const passwordMatch = await verifyPassword(password, user.password);

        if(!passwordMatch){
            return res.status(401).send({
                status: 401,
                message: 'Invalid credentials',
            });
        };

        res.cookie('session_id', excistingUser.id, {
            httpOnly: true,
            sameSite: process.env.NODE_STATE === 'production' ? 'none' : 'lax', 
            secure: process.env.NODE_STATE === 'production', 
            signed: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).send({
            status: 200,
            message: 'Login succesfull',
        });

    }catch(error){
        console.error('Error whith login', error);
        return res.status(500).send({
            status: 500,
            message: error.message
        });
    }
} 

const registerUser = async(req, res, collection) => {
    try{


    }catch(error){
        console.error('Error whith login', error);
        return res.status(500).send({
            status: 500,
            message: error.message
        });
    }
} 
module.exports = {
    loginUser,
    registerUser
};