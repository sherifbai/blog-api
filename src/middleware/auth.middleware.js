module.exports = async (req, res, next) => {
    try {
        if (!req.user) {
            return next();
        }
        req.isAuthenticated = true;
        next();
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
