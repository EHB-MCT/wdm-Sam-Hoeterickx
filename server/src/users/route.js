const express = require('express');
const router = express.Router();

const { loginUser, registerUser } = require('./controller');

module.exports = (collection) => {
    router.post('/login', (req, res) => loginUser(req, res, collection));
    router.post('/register', (req, res) => registerUser(req, res, collection));

    return router;
}