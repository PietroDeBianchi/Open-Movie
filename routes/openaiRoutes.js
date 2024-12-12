const express = require('express');
const router = express.Router();
const { movieSession, getMovies } = require('../controllers/movieController');
const { testSession } = require('../controllers/testController');

//////////////////////////////////////////////////
// MOVIE TEST
//////////////////////////////////////////////////
router.post('/movieSession', movieSession);
router.get('/getMovies', getMovies);
//////////////////////////////////////////////////
// TEST
//////////////////////////////////////////////////
router.post('/testSession', testSession);

module.exports = router;