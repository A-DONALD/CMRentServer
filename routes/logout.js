const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.get('/logout', userCtrl.logout);

module.exports = router;