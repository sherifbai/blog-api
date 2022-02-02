const User = require('../models/user.model');

exports.giveAdmin = async (req, res, next) => {
    const { id } = req.params;

    try {
        const admin = await User.findById(req.userId);

        if (!admin.isAdmin) {
            const error = new Error('You are not admin');
            error.statusCode = 403;
            throw error;
        }
        
        const user = await User.findById(id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        user.isAdmin = true;

        await user.save();

        user.password = null;

        res.status(200).json({ user });
    } catch (error) {
        if (!error.statusCode) {
            statusCode = 500;
        }
        next(error);
    }
}

exports.removeAdmin = async (req, res, next) => {
    const { id } = req.params;

    try {
        const admin = await User.findById(req.userId);

        if (!admin.isAdmin) {
            const error = new Error('You are not admin');
            error.statusCode = 403;
            throw error;
        }

        const user = await User.findById(id);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        user.isAdmin = false;

        await user.save();
        
        user.password = null;

        res.status(200).json({ user });
    } catch (error) {
        if (!error.statusCode) {
            statusCode = 500;
        }
        next(error);
    }
}
