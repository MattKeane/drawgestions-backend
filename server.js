require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')
const Room = require('./models/room')
const User = require('./models/user')

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
    console.log('Socket connected: ', socket.id)

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

    socket.on('suggestion', async suggestion => {
        try {
            console.log(socket.id)
            const user = await User.findOne({ socket: socket.id })
            console.log(user)
            if (user.suggestions.length < 3) {
                user.suggestions.push(suggestion)
                await user.save()
                console.log(user)
            }
        } catch (err) {
            const d = new Date()
            console.log(`${d.toLocaleString()}: Error making suggestion`)
            console.log(err)
        }
    })
})

require('./db/db')

// middleware

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use((req, res, next) => {
    // This makes socket.io available inside of all routes
    req.io = io
    next()
})

const roomController = require('./controllers/roomController')
app.use('/room', roomController)

const userController = require('./controllers/userController')
app.use('/user', userController)

app.all('*', (req, res) => {
    res.status(404).json({
        message: '404: Resource Not Found'
    })
})


server.listen(PORT, () => {
    const d = new Date()
    console.log(`${d.toLocaleString()}: now listening on port ${PORT}`)
})