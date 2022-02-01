const { verify } = require('jsonwebtoken'); 

module.exports = async (req, res, next) => {
    const header = req.get('authorization');
    
    if (!header) {
        const error = new Error('Not authentication');
        error.statusCode = 401;
        throw error;
    }

    const token = header.split(' ')[1];

    try {
        const decodedToken = verify(token, process.env.SECRET);

        req.login = decodedToken.login;
        req.userId = decodedToken.userId;

        next();
    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
}
