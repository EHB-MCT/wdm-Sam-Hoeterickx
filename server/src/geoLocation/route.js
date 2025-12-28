const express = require('express');
const router = express.Router();

const { saveGeoLocationData, getAllGeoLocationData } = require('./controller');

module.exports = (geoLocationCollection, sessionCollection) => {
    
    router.get('/', (req, res) => getAllGeoLocationData(req, res, geoLocationCollection))
    router.post('/save', (req, res) => saveGeoLocationData(req, res, geoLocationCollection, sessionCollection));
    
    return router
}