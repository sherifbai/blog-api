const { Router } = require('express');

const postController = require('../controllers/post.controller');
const isAuth = require('../middleware/auth.middleware');

const router = Router();

router.post('/', isAuth, postController.createPost);
router.get('/', isAuth, postController.getPosts);

module.exports = router;
