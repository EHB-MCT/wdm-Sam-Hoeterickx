const express = require('express');
const router = express.Router();

const { getQuestions, addQuestions } = require('./controller.js');

module.exports = (collection) => {
    
    router.get('/questions', (req, res) => getQuestions(req, res, collection));
    router.post('/questions', (req, res) => addQuestions(req, res, collection));
    return router
    
}