const { Router } = require('express');

const postController = require('../controllers/post.controller');
const isAuth = require('../middleware/auth.middleware');

const router = Router();

router.get('/create', isAuth, postController.createPostView);
router.post('/create', isAuth, postController.createPost);
router.get('/', isAuth, postController.getPosts);
router.get('/post/:id', isAuth, postController.getPost);

module.exports = router;
