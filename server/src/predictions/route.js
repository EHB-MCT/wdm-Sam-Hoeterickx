const express = require('express');
const router = express.Router();

const { savePrediction } = require('./controller.js');

module.exports = (collection) => {
    // router.post('/savePrediction', (req, res) => savePrediction(req, res, collection));
    router.post('/savePrediction', (req, res) => {
        console.log(req.body);
    })

    return router
}