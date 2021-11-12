require('dotenv').config()
const express = require('express')

const { PORT } = process.env

const app = express()

require('./db/db')

// middleware

app.use(express.json())

const roomController = require('./controllers/roomController')
app.use('/room', roomController)

app.all('*', (req, res) => {
    res.status(404).json({
        message: '404: Resource Not Found'
    })
})


app.listen(PORT, () => {
    const d = new Date()
    console.log(`${d.toLocaleString()}: now listening on port ${PORT}`)
})