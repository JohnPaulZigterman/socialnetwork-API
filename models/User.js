const { Schema, Types, model } = require('mongoose');

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
            match: [/^.+\@.+\..+$/, "Please use a valid email"],
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: "Thought",
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

userSchema
    .virtual('friendCount')
    .get(function () {
        return this.friends.length;
    })
    .set(function(friends) {
        this.set({ friends });
    });

const User = model('User', userSchema);

module.exports = User;