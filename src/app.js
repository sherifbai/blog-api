const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const { hash } = require('bcrypt');
const { engine } = require('express-handlebars');

const userRouter = require('./routes/user.route');
const adminRouter = require('./routes/admin.route');
const postRouter = require('./routes/post.route');

const User = require('./models/user.model');

const app = express();

require('dotenv').config();
require('./connection/mongoose.connection');
require('./config/passport')(passport);

app.engine('hbs', engine({
    defaultLayout: 'main',
    extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views/');

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(flash());

app.use('/admin', adminRouter);
app.use('/', postRouter);
app.use('/user', userRouter);

app.use(function (error, req, res, next) {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    const user = await User.findOne({login: 'admin'});

    if (!user) {
        const hashedPw = await hash('admin', 12);

        const user = new User({
            login: 'admin',
            password: hashedPw,
            isAdmin: true,
            posts: [],
        });

        await user.save();
    }
});
