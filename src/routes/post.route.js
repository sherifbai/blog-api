const { Router } = require('express');

const postController = require('../controllers/post.controller');
const isAuth = require('../middleware/auth.middleware');

const router = Router();

router.post('/', isAuth, postController.createPost);

module.exports = router;
