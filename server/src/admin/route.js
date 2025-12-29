const express = require('express');
const router = express.Router();

const { authenticateAdmin } = require('./controller');

module.exports = (adminCollection, answerCollection, browserCollection, confidenceCollection, geoLocationCollection, sessionCollection, userCollection) => {

    router.get('/authenticate', (req, res) => authenticateAdmin(req, res, userCollection));

    return router
}