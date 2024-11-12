const express = require('express');
const router = express.Router();
const { getResponse } = require('../controllers/openaiController');

//////////////////////////////////////////////////
// ASSISTANT INTERACTIONS
//////////////////////////////////////////////////
router.post('/assistantResponse', getResponse);


module.exports = router;
