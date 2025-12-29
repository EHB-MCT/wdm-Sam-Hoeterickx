const express = require('express');
const router = express.Router();


module.exports = (adminCollection) => {

    router.get('/', (req, res) => handle(req, res, adminCollection))

    return router
}