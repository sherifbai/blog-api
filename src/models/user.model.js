const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        login: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        posts: [{
            type: Schema.Types.ObjectId,
            ref: 'Post',
        }],
        quantity: {
            type: Number,
            default: 0,
        }
    }, {
        timestamps: true
    }
);

module.exports = model('User', userSchema);
