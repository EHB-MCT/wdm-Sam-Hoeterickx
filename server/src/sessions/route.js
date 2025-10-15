const express = require('express');
const router = express.Router();

const { createSessionId } = require('./controller.js');

module.exports = (collection) => {
    router.get('/sessionId', (req, res) => createSessionId(req, res, collection))
    
    return router
}