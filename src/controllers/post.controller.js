const res = require('express/lib/response');
const Post = require('../models/post.model');
const User = require('../models/user.model');

exports.createPost = async (req, res, next) => {
    const { title, text } = req.body;

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
