// Ping .get request
const express = require('express');
const router = express.Router();

const pingLogic = require('../services/ping-logic.js');

router.get('/ping', pingLogic);

module.exports = router;