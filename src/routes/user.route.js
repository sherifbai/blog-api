const { Router } = require('express');

const userController = require('../controllers/user.controller');

const router = Router();

router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);

module.exports = router;
