const Post = require('../models/post.model');
const User = require('../models/user.model');

exports.createPost = async (req, res, next) => {
    const { title, text } = req.body;
    console.log(req.body);

    try {
        if (req.userId) {
            const post = new Post({
                title: title,
                text: text,
                creator: req.userId,
            });
            
            await post.save();

            const user = await User.findById(req.userId);

            user.posts.push(post._id.toString());
            user.quantity += 1;
            
            await user.save();

            return res.status(201).json({ post });
        } else {
            const post = new Post({
                title: title,
                text: text,
                creator: null,
            });
            
            await post.save();

            return res.status(201).json({ post });
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.deletePost = async (req, res, next) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) {
            const error = new Error('Post does not found');
            error.statusCode = 404;
            throw error;
        }

        const creator = await User.findById(post.creator);

        if (creator) {
            const index = creator.posts.findIndex(el => el._id.toString() === post._id.toString());
            creator.posts.splice(index, 1);
            creator.quantity -= 1;

            await creator.save();
        }

        await Post.findByIdAndRemove(id);



        res.status(200).json({
            message: 'Post deleted',
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.updatePost = async (req, res, next) => {
    const { title, text } = req.body;
    const { id } = req.params;

    try {
        const post = await Post.findById(id).populate('creator');

        if (!post) {
            const error = new Error('Post does not found');
            error.statusCode = 404;
            throw error;
        }

        await Post.findByIdAndUpdate({ _id: id }, { $set: { title, text } });

        res.status(200).json({
            message: 'Post updated',
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.setVisible = async (req, res, next) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) {
            const error = new Error('Post does not found');
            error.statusCode = 404;
            throw error;
        }

        await Post.findByIdAndUpdate({ _id: id }, { $set: { isVisible: true } });

        res.status(200).json({
            message: 'Post updated',
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.unsetVisible = async (req, res, next) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);

        if (!post) {
            const error = new Error('Post does not found');
            error.statusCode = 404;
            throw error;
        }

        const updatedPost = await Post.findByIdAndUpdate({ _id: id }, { $set: { isVisible: false } });

        res.status(200).json({
            post: updatedPost
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate('creator');

        res.status(200).json({ posts });
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

        res.status(200).json({ post });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
