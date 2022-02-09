const LocalStrategy = require('passport-local');
const { compare } = require('bcrypt');

const User = require('../models/user.model');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'login' }, async (login, password, done) => {
            const user = await User.findOne({ login });

            if (!user) {
                return done(null, false, { message: 'User does not found' });
            }

            const isEqualPw = await compare(password, user.password);

            if (!isEqualPw) {
                return done(null, false, { message: 'Passwords does not match' });
            }

            return done(null, user);
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}
