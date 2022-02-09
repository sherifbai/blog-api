const Post = require('../models/post.model');
const User = require('../models/user.model');

exports.createPostView = (req, res, next) => {
    res.render('post/create', {
        title: 'Добавление новости',
        isAdd: true,
        isAuthenticated: req.isAuthenticated,
    });
}

exports.createPost = async (req, res, next) => {
    const { title, text } = req.body;

    try {
        if (req.user) {
            const post = new Post({
                title: title,
                text: text,
                creator: req.user._id,
            });
            
            await post.save();

            const user = await User.findById(req.user._id);

            user.posts.push(post._id.toString());
            user.quantity += 1;
            
            await user.save();

            return res.redirect('/');
        } else {
            const post = new Post({
                title: title,
                text: text,
                creator: null,
            });
            
            await post.save();

            return res.redirect('/');
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getPosts = async (req, res, next) => {
    const error = req.flash('error')[0];
    let isAdmin = false

    if (req.user) {
        isAdmin = req.user.isAdmin || false;
    }
    
    try {
        const posts = await Post.find({ isVisible: true }).populate('creator');
        res.render('post/posts', {
            title: 'Список новостей',
            isPosts: true,
            isAuthenticated: req.isAuthenticated,
            posts: posts.map(el => el.toJSON()),
            errorMessage: error,
            isAdmin: isAdmin
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getPost = async (req, res, next) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id).populate('creator');

        if (!post) {
            const error = new Error('Post does not found');
            error.statusCode = 404;
            throw error;
        }

        res.render('post/post', {
            title: 'Новость',
            post: post.toJSON(),
            isAuthenticated: req.isAuthenticated,
            isAdmin: req.isAdmin
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
