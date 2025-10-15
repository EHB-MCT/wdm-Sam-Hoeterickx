const express = require('express');
const router = express.Router();

const { handlePrompt } = require('./controller.js')

router.get('/chat', (req, res) => handlePrompt(req, res));

module.exports = router;