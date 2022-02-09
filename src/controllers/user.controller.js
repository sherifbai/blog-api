const User = require('../models/user.model');
const { hash } = require('bcrypt');
const passport = require('passport');

exports.signUpView = (req, res, next) => {
    const error = req.flash('error')[0];
    res.render('user/signup', {
        title: 'Регистрация',
        isSignUp: true,
        isAuthenticated: false,
        errorMessage: error,
    });
}

exports.signUp = async (req, res, next) => {
    const { login, password } = req.body;

    try {
        const isUsed = await User.findOne({ login });

        if (isUsed) {
            req.flash('error', 'Логин уже занят!!!');
            return res.redirect('/user/signup');
        }

        const hashedPW = await hash(password, 12);

        const user = new User({
            login: login,
            password: hashedPW,
            posts: [],
        });

        await user.save();

        return res.redirect('/user/signin');
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.signInView = (req, res, next) => {
    const error = req.flash('error')[0];
    res.render('user/signin', {
        title: 'Вход',
        isLogin:true,
        isAuthenticated: false,
        errorMessage: error
    });
}

exports.signIn = async (req, res, next) => {
    try {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/user/signin',
            failureFlash: true
        })(req, res, next);
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.logout = async (req, res, next) => {
    req.logout();
    res.redirect('/');
}
