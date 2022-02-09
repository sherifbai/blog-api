const User = require('../models/user.model');

module.exports = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.redirect('user/signin')
        }

        const admin = await User.findById(req.user._id);

        if (admin === null || !admin.isAdmin) {
            req.flash('error', 'Вы не админестратор');
            res.redirect('/')
        }
        
        req.isAdmin = true;

        next();
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
