const express = require('express');
const router = express.Router();

const { getQuestions, addQuestions } = require('./controller.js');

/**
 * Routes
 * - GET /
 * - POST /questions
 * 
 * @param {Object} collection - MongoDB Questions collection.
 * @returns {Router} - Express router
 */
module.exports = (collection) => {
    router.get('/', (req, res) => getQuestions(req, res, collection));
    router.post('/questions', (req, res) => addQuestions(req, res, collection));
    return router
    
}