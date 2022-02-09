const User = require('../models/user.model');
const Post = require('../models/post.model');

exports.updatePostView = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate('creator');

    if (!post) {
      req.flash('error', 'Новость не найдено!');
      return res.redirect('/admin');
    }

    res.render('admin/edit', {
      title: 'Редактирование новости',
      post: post.toJSON(),
      isAuthenticated: req.isAuthenticated,
      isAdmin: true
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  const { title, text } = req.body;
  const { id } = req.params;
  const isVisible = req.body.isVisible || false;
  

  try {
    const post = await Post.findById(id).populate('creator');

    if (!post) {
        req.flash('error', 'Новость не найдено!');
        return res.redirect('/admin');
    }

    await Post.findByIdAndUpdate({ _id: id }, { $set: { title, text, isVisible } });

    return res.redirect('/admin/');
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
        req.flash('error', 'Новость не найдено!');
        return res.redirect('/admin');
    }

    const creator = await User.findById(post.creator);

    if (creator) {
      const index = creator.posts.findIndex(
        (el) => el._id.toString() === post._id.toString()
      );
      creator.posts.splice(index, 1);
      creator.quantity -= 1;

      await creator.save();
    }

    await Post.findByIdAndRemove(id);

    return res.redirect('/admin/');
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('creator');

    res.render('admin/posts', {
      title: 'Список новостей',
      posts: posts.map((el) => el.toJSON()),
      isAuthenticated: req.isAuthenticated,
      isAdmin: req.isAdmin
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        return res.render('admin/users', {
            title: 'Пользователи',
            users: users.map(el => el.toJSON()),
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

exports.giveAdmin = async (req, res, next) => {
  const { id } = req.params;

  try {

    const user = await User.findById(id);

    if (!user) {
        req.flash('error', 'Пользователь не найден!');
        return res.redirect('/admin');
    }

    user.isAdmin = true;

    await user.save();

    return res.redirect('/admin/users');
  } catch (error) {
    if (!error.statusCode) {
      statusCode = 500;
    }
    next(error);
  }
};

exports.removeAdmin = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
        req.flash('error', 'Пользователь не найден!');
        return res.redirect('/admin');
    }

    user.isAdmin = false;

    await user.save();

    return res.redirect('/admin/users');
  } catch (error) {
    if (!error.statusCode) {
      statusCode = 500;
    }
    next(error);
  }
};
