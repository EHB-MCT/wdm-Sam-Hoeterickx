const express = require('express');
const router = express.Router();

const { answerQuestion } = require('./controller.js');

module.exports = (collection) => {
    router.post('/saveAnswer', (req, res) => answerQuestion(req, res, collection));

    return router
}