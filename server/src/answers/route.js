const express = require('express');
const router = express.Router();

const { answerQuestion, getAnswers } = require('./controller.js');

module.exports = (collection) => {
    router.get('/', (req, res) => getAnswers(req, res, collection))
    router.post('/saveAnswer', (req, res) => answerQuestion(req, res, collection));
    return router
}