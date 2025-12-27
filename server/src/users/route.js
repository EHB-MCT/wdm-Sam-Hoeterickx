const express = require('express');
const router = express.Router();

const { loginUser, registerUser, logoutUser, getUserInfo, authenticateUser } = require('./controller');

/**
 * Creates user routes with injected collections
 * 
 * Routes
 * - GET /
 * - GET /authenticate
 * - POST /login
 * - POST /register
 * - POST /logout
 * 
 * @param {Object} userCollection - MongoDB Users collection
 * @param {Object} answerCollection - MongoDB Answers collection
 * @param {Object} sessionCollection - MongoDB Sessions collection
 * @param {Object} confidenceCollection - MongoDB Confidence collection
 * @returns {Object} Express router
 */
module.exports = (userCollection, answerCollection, sessionCollection, confidenceCollection) => {
    router.get('/', (req, res) => getUserInfo(req, res, userCollection, answerCollection, sessionCollection, confidenceCollection));
    router.get('/authenticate', (req, res) => authenticateUser(req, res, userCollection));

    router.post('/login', (req, res) => loginUser(req, res, userCollection));
    router.post('/register', (req, res) => registerUser(req, res, userCollection));
    router.post('/logout', (req, res) => logoutUser(req, res));

    return router;
};