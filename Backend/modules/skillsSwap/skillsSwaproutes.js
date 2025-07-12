const express = require('express');
const {   createSwapRequest,assignSwapper } = require('./skillsSwapcontrollers');

const router = express.Router();

router.post('/swap', createSwapRequest);
router.post('/swap/assign', assignSwapper);

module.exports = router;