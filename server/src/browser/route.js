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
    router.get('/', (req, res) => getBrowserData(req, res, browserDataCollection));
    router.post('/track', (req, res) => saveBrowserData(req, res, browserDataCollection));
    
    return router;
}