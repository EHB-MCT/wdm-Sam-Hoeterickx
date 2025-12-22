const express = require('express');
const router = express.Router();

module.exports = (collection) => {
    router.post('/login', (req, res) => loginUser(req, res, collection));
}