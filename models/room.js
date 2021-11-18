const mongoose = require('mongoose')
const User = require('./user')

const roomSchema = new mongoose.Schema({
    accessCode: {
        type: String,
        required: true,
        unique: true,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now,
    },
    open: {
        type: Boolean,
        default: true,
    },
})

const Room = mongoose.model('Room', roomSchema)

module.exports = Room