const { Schema, model } = require('mongoose');

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: 'Guest',
        },
        isVisible: {
            type: Boolean,
            default: true,
        }
    }, {
        timestamps: true,
    }
);

module.exports = model('Post', postSchema);
