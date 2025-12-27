const express = require('express');
const router = express.Router();

const { answerQuestion, getAnswers } = require('./controller.js');

/**
 * Creates answer routes with injected collection
 * @param {Object} answerCollection - MongoDB Answers collection
 * @returns {Object} Express router
 */
module.exports = (answerCollection) => {
    router.get('/', (req, res) => getAnswers(req, res, answerCollection));
    router.post('/saveAnswer', (req, res) => answerQuestion(req, res, answerCollection));
    return router;
};