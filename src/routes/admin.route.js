const { Router } = require('express');

const isAuth = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');

const router = Router();

router.post('/giveadmin/:id', isAuth, adminController.giveAdmin);
router.post('/removeadmin/:id', isAuth, adminController.removeAdmin);

module.exports = router;
