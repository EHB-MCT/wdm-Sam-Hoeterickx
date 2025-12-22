const {
    findUserByEmail,
    verifyPassword
} = require('./model');

export const loginUser = async(req, res, collection) => {
    try{

        const userId = req.signedCookies.user;
        const {email, password} = req.body;

        if(userId){
            return res.status(200).send({
                status: 200,
                message: 'Login Successful',
                login: true
            });
        };

        if(!email || !password){
            return res.status(422).send({
                status: 422,
                message: 'Missing login info'
            });
        };

        const user = await findUserByEmail(collection, email);
        
        if(!user){
            return res.status(401).send({
                status: 401,
                message: 'Invalid credentials'
            });
        };

        
        const passwordMatch = await verifyPassword(password, user.password);

        if(!passwordMatch){
            return res.status(401).send({
                status: 401,
                message: 'Invalid credentials'
            });
        };



    }catch(error){
        console.error('Error whith login', error);
        return res.status(500).send({
            status: 500,
            message: error.message
        });
    }
} 