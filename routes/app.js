const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userCtrl = require('../controllers/user');

router.get('/user', auth, userCtrl.getAllUser);

module.exports = router;