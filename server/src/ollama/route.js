const express = require('express');
const router = express.Router();

const { handlePrompt, generateBatchPrediction, generatePrediction } = require('./controller.js')


module.exports = (collection, answersCollection, questionsCollection) => {

router.get('/chat', (req, res) => handlePrompt(req, res));
    router.get('/predict-next-answer', (req, res) => generatePrediction(req, res, collection, answersCollection, questionsCollection))
    router.get('/predict-next-ten', (req, res) => generateBatchPrediction(req, res, collection, answersCollection, questionsCollection))

    return router
};