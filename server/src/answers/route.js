const express = require('express');
const router = express.Router();

const { answerQuestion } = require('./controller.js');

module.exports = (collection) => {
    router.post('/answer', (req, res) => answerQuestion(req, res, collection));
    
    return router
}