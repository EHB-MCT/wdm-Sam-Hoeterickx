const express = require('express');
const router = express.Router();

const { saveConfidenceCheck } = require('./controller.js');

/**
 * Routes
 * - POST /save
 * 
 * @param {Object} collection - MongoDB Confidence_checks collection.
 * @returns {Router} - Express router
 */
module.exports = (collection) => {
    router.post('/save', (req, res) => saveConfidenceCheck(req, res, collection))

    return router
}