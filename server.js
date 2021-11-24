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
            const suggester = await User.findOne({ socket: socket.id })
            // only allow the user to add 3 suggestions
            if (suggester.suggestions.length < 3) {
                suggester.suggestions.push(suggestion)
                await suggester.save()
                if (suggester.suggestions.length === 3) {
                    const room = await Room
                        .findOne({ users: suggester })
                        .populate('users')
                    // check if all users have submited 3 suggestions
                    if (room.users.every(user => user.suggestions.length >= 3)) {
                        room.users.forEach(async user => {
                            try {
                                const othersSuggestions = room.users.reduce((acc, cur) => {
                                    if (cur !== user) {
                                        cur.suggestions.forEach((suggestion, i) => {
                                            const suggestionData = {
                                                suggestion,
                                                user: cur,
                                                index: i,
                                            }
                                            acc.push(suggestionData)
                                        })
                                    }
                                    return acc
                                }, [])
                                const randomIndex = Math.floor(Math.random() * othersSuggestions.length)
                                const chosen = othersSuggestions[randomIndex]
                                io.to(user.socket).emit('drawThis', chosen.suggestion)
                                chosen.user.suggestions.splice(chosen.index, 1)
                                await chosen.user.save()
                            } catch (err) {
                                const d = new Date()
                                console.log(`${d.toLocaleString()}: Error assigning suggestions`)
                                console.log(err)
                            }
                        })
                    }
                }
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