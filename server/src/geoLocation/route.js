const express = require('express');
const router = express.Router();

const { saveGeoLocationData, getAllGeoLocationData } = require('./controller');

/**
 * Creates and configures geolocation routes
 * 
 * @param {Object} geoLocationCollection - MongoDB collection for geolocation data
 * @param {Object} sessionCollection - MongoDB collection for session data
 * @returns {Object} Express router with geolocation endpoints configured
 */
module.exports = (geoLocationCollection, sessionCollection) => {
    
/**
     * GET /api/geoLocation/
     * Retrieves all geolocation data from the database
     */
    router.get('/', (req, res) => getAllGeoLocationData(req, res, geoLocationCollection));
    
    /**
     * POST /api/geoLocation/save
     * Saves geolocation data for the current session
     * Requires session cookie and geolocation data in request body
     */
    router.post('/save', (req, res) => saveGeoLocationData(req, res, geoLocationCollection, sessionCollection));
    
    return router
}