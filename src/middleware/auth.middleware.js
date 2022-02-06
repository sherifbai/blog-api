const { verify } = require('jsonwebtoken'); 

module.exports = async (req, res, next) => {
    const header = req.get('authorization');

    try {
        if (header === 'Bearer') {
            const error = new Error('Auth header is empty!');
            error.statusCode = 403;
            throw error;
        }
        
        if (!header) {
            next();
            return
        }
    
        const token = header.split(' ')[1];

        const decodedToken = verify(token, process.env.SECRET);

        req.login = decodedToken.login;
        req.userId = decodedToken.userId;

        next();
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}
