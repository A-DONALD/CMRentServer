const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/stuff');
const ROLE_LIST = require('../config/role_list');
const auth = require('../middleware/authorization')

router.post('/', auth(ROLE_LIST.Admin, ROLE_LIST.Editor), stuffCtrl.addThing);
router.put('/:id', auth(ROLE_LIST.User, ROLE_LIST.Editor), stuffCtrl.modifyThing);
router.delete('/:id', auth(ROLE_LIST.Admin), stuffCtrl.deleteThing);
router.get('/', stuffCtrl.getAllThing);
router.get('/:id', auth(ROLE_LIST.User), stuffCtrl.getOneThing);

module.exports = router;