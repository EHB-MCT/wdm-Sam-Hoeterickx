const express = require('express');
const router = express.Router();

const { loginUser, registerUser, logoutUser } = require('./controller');

module.exports = (collection) => {
    router.post('/login', (req, res) => loginUser(req, res, collection));
    router.post('/register', (req, res) => registerUser(req, res, collection));
    router.post('/logout', (req, res) => logoutUser(req, res));
    return router;
}