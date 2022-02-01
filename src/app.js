const express = require('express');
const { hash } = require('bcrypt');

const userRouter = require('./routes/user.route');
const adminRouter = require('./routes/admin.route');
const User = require('./models/user.model');

const app = express();

require('dotenv').config();
require('./connection/mongoose.connection');

app.use(express.json());

app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

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
            posts: { items: [] }
        });

        await user.save();
    }
});
