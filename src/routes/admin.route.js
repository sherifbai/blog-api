const { Router } = require('express');

const isAuth = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/is.admin.middleware');
const adminController = require('../controllers/admin.controller');
const postController = require('../controllers/post.controller');

const router = Router();

router.get('/users', isAuth, isAdmin, adminController.getUsers);
router.post('/giveadmin/:id', isAuth, isAdmin, adminController.giveAdmin);
router.post('/removeadmin/:id', isAuth, isAdmin, adminController.removeAdmin);

router.get('/', isAuth, isAdmin, adminController.getPosts);
router.get('/posts/:id', isAuth, isAdmin, postController.getPost);

router.get('/post/edit/:id', isAuth, isAdmin, adminController.updatePostView);
router.post('/post/edit/:id', isAuth, isAdmin, adminController.updatePost);

router.get('/post/remove/:id', isAuth, isAdmin, adminController.deletePost);

module.exports = router;
