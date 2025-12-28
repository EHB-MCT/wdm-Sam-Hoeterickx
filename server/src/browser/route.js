const express = require('express');
const router = express.Router();

const { getBrowserData, saveBrowserData } = require('./controller');

/**
 * Creates browser tracking routes with injected collections
 * 
 * Routes
 * 
 * @param {Object} browserDataCollection - MongoDB Browser_data collection
 * @returns {Object} Express router
 */
module.exports = (browserDataCollection) => {
    router.get('/:sessionId', getBrowserData(browserDataCollection));
    router.post('/track', saveBrowserData(browserDataCollection));
    
    return router;
}