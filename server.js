require('dotenv').config()
const express = require('express')

const { PORT } = process.env

const app = express()

require('./db/db')

// middleware

app.use(express.json())

const roomController = require('./controllers/roomController')
app.use('/room', roomController)

app.get('/', (req, res) => {
    res.json({
        message: 'Route works!'
    })
})

app.listen(PORT, () => {
    const d = new Date()
    console.log(`${d.toLocaleString()}: now listening on port ${PORT}`)
})