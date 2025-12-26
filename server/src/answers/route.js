const express = require('express');
const router = express.Router();

const { answerQuestion, getAnswers } = require('./controller.js');

/**
 * Routes
 * - GET /
 * - POST /saveAnswer
 * 
 * @param {Object} collection - MongoDB Answers collection.
 * @returns {Router} - Express router
 */
module.exports = (collection) => {
    router.get('/', (req, res) => getAnswers(req, res, collection))
    router.post('/saveAnswer', (req, res) => answerQuestion(req, res, collection));
    return router
}