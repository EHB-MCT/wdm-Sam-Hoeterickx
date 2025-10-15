const express = require('express');
const router = express.Router();

const { getAllQuestions } = require('./controller.js');

module.exports = (collection) => {
    
    router.get('/', (req, res) => getAllQuestions(req, res, collection));

    return router
    
}