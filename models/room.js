const mongoose = require('mongoose')
const User = require('./user')

const roomSchema = new mongoose.Schema({
    accessCode: String,
    users: [User]
})

const Room = mongoose.model('room', roomSchema)

module.exports = Room