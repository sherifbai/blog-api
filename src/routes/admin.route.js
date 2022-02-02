const { Router } = require('express');

const isAuth = require('../middleware/auth.middleware');
const adminController = require('../controllers/admin.controller');
const postController = require('../controllers/post.controller');

const router = Router();

router.post('/giveadmin/:id', isAuth, adminController.giveAdmin);
router.post('/removeadmin/:id', isAuth, adminController.removeAdmin);

router.delete('/post/:id', isAuth, postController.deletePost);
router.put('/post/:id', isAuth, postController.updatePost);
router.put('/post/unvisible/:id', isAuth, postController.unsetVisible);
router.put('/post/visible/:id', isAuth,postController.setVisible);

module.exports = router;
