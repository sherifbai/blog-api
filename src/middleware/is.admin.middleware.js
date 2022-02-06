const User = require('../models/user.model');

module.exports = async (req, res, next) => {
    try {
        const admin = await User.findById(req.userId);

        if (admin === null || !admin.isAdmin) {
            const error = new Error('You are not admin');
            error.statusCode = 403;
            throw error;
        }

        next();
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
