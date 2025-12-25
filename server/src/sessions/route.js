const express = require('express');
const router = express.Router();

const { createSessionId, readCookie, saveSessionToUser } = require('./controller.js');

module.exports = (sessionCollection, userCollection) => {
    router.get('/sessionId', (req, res) => createSessionId(req, res, sessionCollection))
    router.get('/readCookie', (req, res) => readCookie(req, res));   
    router.post('/save', (req, res) => saveSessionToUser(req, res, sessionCollection, userCollection))
    return router
}