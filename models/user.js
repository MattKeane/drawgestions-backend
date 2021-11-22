const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now
    },
    suggestions: [String],
    socket: String,
})

const User = mongoose.model('User', userSchema)

module.exports = User