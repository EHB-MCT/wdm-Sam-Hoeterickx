const express = require('express');
const router = express.Router();

const { getQuestions } = require('./controller.js');

module.exports = (collection) => {
    
    router.get('/questions', (req, res) => getQuestions(req, res, collection));

    return router
    
}