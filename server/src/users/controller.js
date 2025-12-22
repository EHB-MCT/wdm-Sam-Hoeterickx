const {
    findUserByEmail,
    verifyPassword,
    registerNewUser
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

        if (password.length < 8) {
            return res.status(422).send({
                status: 422,
                message: "Password must be at least 8 characters long"
            });
        }

        if (!/[A-Z]/.test(password)) {
            return res.status(422).send({
                status: 422,
                message: "Password must contain at least one uppercase letter"
            });
        }

        if (!/[a-z]/.test(password)) {
            return res.status(422).send({
                status: 422,
                message: "Password must contain at least one lowercase letter"
            });
        }

        if (!/[0-9]/.test(password)) {
            return res.status(422).send({
                status: 422,
                message: "Password must contain at least one number"
            });
        }

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

        res.cookie('user', user._id, {
            httpOnly: true,
            sameSite: 'none',
            secure: false, 
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
        const { username, email, password, repeatPassword } = req.body;
        const userData = {
            username,
            email,
            password,
            repeatPassword
        }

        if(!username || !email || !password || !repeatPassword){
            return res.status(422).send({
                status: 422,
                message: "Missing register info"
            });
        }

        if(password !== repeatPassword){
            return res.status(401).send({
                status: 401,
                message: "Passwords don't match"
            })
        }

        const user = await findUserByEmail(collection, email);
        if(user){
            return res.status(409).send({
                status: 409,
                message: "Email already in use"
            })         
        }

        const newUser = await registerNewUser(collection, userData);

        if(!newUser.newUser._id) {
            return res.status(401).send({
                status: 401,
                message: "Error while creating account"
            });
        };

        res.cookie('user', newUser.newUser._id, {
            httpOnly: true,
            sameSite: 'none',
            secure: false, 
            signed: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).send({
            status: 201,
            message: "Account created succesfully",
        });

    }catch(error){
        console.error('Error whith login', error);
        return res.status(500).send({
            status: 500,
            message: error.message,
        });
    }
}

const logoutUser = (req, res) => {
    try{
        res.clearCookie('user');

        res.status(200).send({ message: 'Logged out successfully' });

    }catch(error){
        console.error('Error whith logout', error);
        return res.status(500).send({
            status: 500,
            message: error.message,
        });
    }
}
module.exports = {
    loginUser,
    registerUser,
    logoutUser
};