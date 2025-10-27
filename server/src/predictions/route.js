const express = require('express');
const router = express.Router();

import { savePrediction } from './controller';

module.exports = (collection) => {
    router.post('/savePrediction', (req, res) => savePrediction(req, res, collection));

    return router
}