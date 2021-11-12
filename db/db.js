const mongoose = require('mongoose')

const { MONGODB_URI } = process.env

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.on('connected', () => {
    const d = new Date()
    console.log(`${d.toLocaleString()}: Connected to MongoDB`)
})

mongoose.connection.on('disconnected', () => {
    const d = new Date()
    console.log(`${d.toLocaleString()}: Disconnected from MongoDB`)
})

mongoose.connection.on('error', err => {
    const d = new Date()
    console.log(`${d.toLocaleString()}: Error with MongoDB`)
    console.log(err)
})