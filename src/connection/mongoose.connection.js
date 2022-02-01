const mongoose = require('mongoose');

try {
    mongoose.connect(process.env.URI).then(() => {
        console.log('MongoDB Connected');
    });
} catch (error) {
    mongoose.connection.on('error', () => console.log(error));
}
