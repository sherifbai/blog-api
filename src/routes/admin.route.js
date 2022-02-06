const { Router } = require('express');

const isAuth = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/is.admin.middleware');
const adminController = require('../controllers/admin.controller');
const postController = require('../controllers/post.controller');

const router = Router();

router.post('/giveadmin/:id', isAuth, isAdmin, adminController.giveAdmin);
router.post('/removeadmin/:id', isAuth, isAdmin, adminController.removeAdmin);

router.get('/posts', isAuth, isAdmin, postController.getPosts);
router.get('/posts/:id', isAuth, isAdmin, postController.getPost);
router.delete('/post/:id', isAuth, isAdmin, postController.deletePost);
router.put('/post/:id', isAuth, isAdmin, postController.updatePost);
router.put('/post/unvisible/:id', isAuth, isAdmin, postController.unsetVisible);
router.put('/post/visible/:id', isAuth, isAdmin, postController.setVisible);

module.exports = router;
