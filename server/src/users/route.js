const express = require('express');
const router = express.Router();

const { loginUser } = require('./controller');

module.exports = (collection) => {
    router.post('/login', (req, res) => loginUser(req, res, collection));

    return router;
}