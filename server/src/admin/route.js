const express = require('express');
const router = express.Router();

const { authenticateAdmin, collectAllData, collectAllDataFromUsers, collectAllSessionsPerUser } = require('./controller');

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