const express = require('express');
const router = express.Router();

const { saveConfidenceCheck } = require('./controller.js');

module.exports = (collection) => {
    router.post('/save', (req, res) => saveConfidenceCheck(req, res, collection))

    return router
}