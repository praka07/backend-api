const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    pin: {
        type: String,
        required: true,
        trim: true
    },
    products: {
        id: {
            type: String
        },
        name: {
            type: String,
            trim: true
        },
        desc: {
            type: String,
            trim: true
        }

    }
});

const User = mongoose.model("users", userSchema);
module.exports = User;