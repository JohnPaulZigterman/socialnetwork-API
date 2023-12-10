const { Schema, Types, model } = require('mongoose');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            min_length: 1,
            max_length: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: dateFormat,
        }
    }
);

function dateFormat(Date) {
    return(Date.toLocaleDateString('en-us'));
}