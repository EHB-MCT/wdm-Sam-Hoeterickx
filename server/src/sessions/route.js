const express = require('express');
const router = express.Router();

const { createSessionId, readCookie, saveSessionToUser } = require('./controller.js');

/**
 * Creates session routes with injected collections
 * @param {Object} sessionCollection - MongoDB Session collection
 * @param {Object} userCollection - MongoDB User collection
 * @returns {Object} Express router
 */
module.exports = (sessionCollection, userCollection) => {
    router.get('/sessionId', (req, res) => createSessionId(req, res, sessionCollection));
    router.get('/readCookie', (req, res) => readCookie(req, res));   
    router.post('/save', (req, res) => saveSessionToUser(req, res, sessionCollection, userCollection));
    return router;
};