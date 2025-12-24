const express = require('express');
const router = express.Router();

const { loginUser, registerUser, logoutUser, getUserInfo, authenticateUser } = require('./controller');

module.exports = (collection) => {
    router.post('/login', (req, res) => loginUser(req, res, collection));
    router.post('/register', (req, res) => registerUser(req, res, collection));
    router.post('/logout', (req, res) => logoutUser(req, res));

    router.get('/', (req, res) => getUserInfo(req, res, collection));
    router.get('/authenticate', (req, res) => authenticateUser(req, res, collection))
    return router;
}