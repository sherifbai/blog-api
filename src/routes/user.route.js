const { Router } = require('express');

const userController = require('../controllers/user.controller');

const router = Router();

router.get('/signup', userController.signUpView);
router.post('/signup', userController.signUp);
router.get('/signin', userController.signInView);
router.post('/signin', userController.signIn);
router.get('/logout', userController.logout);

module.exports = router;
