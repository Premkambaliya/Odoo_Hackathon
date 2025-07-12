const express = require('express');
const {   createSwapRequest,assignSwapper,getAllSwapRequests} = require('./skillsSwapcontrollers');

const router = express.Router();

router.post('/swap', createSwapRequest);
router.post('/swap/assign', assignSwapper);
router.get('/swap/all', getAllSwapRequests);

module.exports = router;