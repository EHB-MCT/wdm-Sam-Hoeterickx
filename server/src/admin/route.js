const express = require('express');
const router = express.Router();

const { authenticateAdmin, collectAllData, collectAllDataFromUsers, collectAllSessionsPerUser } = require('./controller');

/**
 * Creates admin router with all admin routes
 * @param {Object} adminCollection - Admin collection
 * @param {Object} answerCollection - Answer collection
 * @param {Object} browserCollection - Browser data collection
 * @param {Object} confidenceCollection - Confidence collection
 * @param {Object} geoLocationCollection - Geo location collection
 * @param {Object} sessionCollection - Session collection
 * @param {Object} userCollection - User collection
 * @returns {Object} Express router
 */
module.exports = (adminCollection, answerCollection, browserCollection, confidenceCollection, geoLocationCollection, sessionCollection, userCollection) => {

    router.get('/authenticate', (req, res) => authenticateAdmin(req, res, userCollection));
    router.get('/data', (req, res) => collectAllData(req, res, {
        users: userCollection,
        answers: answerCollection,
        sessions: sessionCollection,
        browser: browserCollection,
        confidence: confidenceCollection,
        geoLocation: geoLocationCollection,
        questions: adminCollection,
        admin: adminCollection
    }));

    router.get('/', (req, res) => collectAllDataFromUsers(req, res, {
        users: userCollection,
        answers: answerCollection,
        sessions: sessionCollection,
        browser: browserCollection,
        confidence: confidenceCollection,
        geoLocation: geoLocationCollection,
        questions: adminCollection,
    }));

    router.get('/sessions', (req, res) => collectAllSessionsPerUser(req, res, {
        users: userCollection,
        answers: answerCollection,
        sessions: sessionCollection,
        browser: browserCollection,
        confidence: confidenceCollection,
        geoLocation: geoLocationCollection,
        questions: adminCollection,
    }));

    return router
}