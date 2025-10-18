const express = require('express');
const router = express.Router();

const { createSessionId, readCookie } = require('./controller.js');

module.exports = (collection) => {
    router.get('/sessionId', (req, res) => createSessionId(req, res, collection))
    router.get('/readCookie', (req, res) => readCookie(req, res));   
    return router
}