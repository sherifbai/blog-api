const User = require('../models/user.model');
const { hash, compare } = require('bcrypt');
const { sign } = require('jsonwebtoken');

exports.signUp = async (req, res, next) => {
    const { login, password } = req.body;

    try {
        const isUsed = await User.findOne({ login });

        if (isUsed) {
            const error = new Error('Login already used!!!');
            error.statusCode = 403;
            throw error;
        }

        const hashedPW = await hash(password, 12);

        const user = new User({
            login: login,
            password: hashedPW,
            posts: { items: [] }
        });

        await user.save();

        return res.status(201).json({
            message: 'User created',
            success: true,
            user: user
        });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.signIn = async (req, res, next) => {
    const { login, password } = req.body;

    try {
        const user = await User.findOne({ login });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isEqualPw = await compare(password, user.password);

        if (!isEqualPw) {
            const error = new Error('Password does not match');
            error.statusCode = 422;
            throw error;
        }

        const token = sign(
            {
                login: user.login,
                userId: user._id.toString(),
            },
            process.env.SECRET,
            {expiresIn: '24h'}
        );

        res.status(200).json({ token });

    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
