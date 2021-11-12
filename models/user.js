const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    displayName: String,
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User