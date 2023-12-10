const { Schema, Types, model } = require('mongoose');
const thoughtSchema = require('./Thought');

const userSchema = new Schema(
    {
        userID: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        userName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /.+\@.+\..+/,
        },
        thoughts: [thoughtSchema],
        friends: [userSchema],
    },
    {
        toJSON: {
            getters: true,
        },
    }
);

userSchema
    .virtual('friendCount')
    .get(function () {
        return this.friends;
    })
    .set(function(friends) {
        this.set({ friends });
    });

const User = model('user', userSchema);

module.exports = User;