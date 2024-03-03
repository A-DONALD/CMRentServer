const express = require('express');
const router = express.Router();
const refreshTkn = require('../controllers/refreshTokenController');

router.get('/refresh', refreshTkn.handleRefreshToken);

module.exports = router;