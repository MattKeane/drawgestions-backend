require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const Room = require('./models/room')

const { PORT } = process.env

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    },
})

io.on('connection', socket => {
    socket.on('join', room => {
        socket.join(room)
    })
    socket.on('message', (message, room) => {
        io.to(room).emit('message', message)
    })
    socket.on('start', async accessCode => {
        try {
            await Room.findOneAndUpdate({
                accessCode,
            },
            {
                open: false,
            })
            io.to(accessCode).emit('start')
        } catch (err) {
            const d = new Date()
            console.log(`${d.toLocaleString()}: Error starting game`)
            console.log(err)
        }
    })
})

module.exports = {
    app,
    server,
    io
}