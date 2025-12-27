const express = require('express');
const router = express.Router();

const { saveConfidenceCheck } = require('./controller.js');

/**
 * Creates confidence routes with injected collection
 * @param {Object} confidenceCollection - MongoDB Confidence collection
 * @returns {Object} Express router
 */
module.exports = (confidenceCollection) => {
    router.post('/save', (req, res) => saveConfidenceCheck(req, res, confidenceCollection));
    return router;
};