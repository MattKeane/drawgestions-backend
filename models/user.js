const mongoose = require('mongoose')

const user = new mongooseSchema({
    displayName: String,
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now
    }
})

const User = mongoose.model('user', mongooseSchema)

module.exports = User