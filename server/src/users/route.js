const express = require('express');
const router = express.Router();

const { loginUser, registerUser, logoutUser, getUserInfo, authenticateUser } = require('./controller');

module.exports = (userCollection, answerCollection, sessionCollection) => {
    router.post('/login', (req, res) => loginUser(req, res, userCollection));
    router.post('/register', (req, res) => registerUser(req, res, userCollection));
    router.post('/logout', (req, res) => logoutUser(req, res));

    router.get('/', (req, res) => getUserInfo(req, res, userCollection, answerCollection, sessionCollection));
    router.get('/authenticate', (req, res) => authenticateUser(req, res, userCollection))
    return router;
}