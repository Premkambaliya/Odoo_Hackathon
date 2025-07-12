const express = require('express');
const {   createSwapRequest } = require('./skillsSwapcontrollers');

const router = express.Router();

router.post('/swap', createSwapRequest);

module.exports = router;