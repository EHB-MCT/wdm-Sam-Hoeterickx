const express = require('express');
const router = express.Router();

const { getQuestions, addQuestions } = require('./controller.js');

/**
 * Creates questions routes with injected collection
 * @param {Object} questionsCollection - MongoDB Questions collection
 * @returns {Object} Express router
 */
module.exports = (questionsCollection) => {
    router.get('/', (req, res) => getQuestions(req, res, questionsCollection));
    router.post('/questions', (req, res) => addQuestions(req, res, questionsCollection));
    return router;
};