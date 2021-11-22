const express = require('express')
const User = require('../models/user')
const Room = require('../models/room')

const router = express.Router()

router.post('/new', async (req, res) => {
    try {
        const roomToJoin = await Room.findOne({ accessCode: req.body.accessCode }).populate('users')
        if (roomToJoin) {
            if (roomToJoin.open) {
                if (roomToJoin.users.some(user => user.displayName === req.body.displayName)) {
                    res.json({
                        message: 'Username already taken',
                        joined: false,
                    })
                } else {
                    const newUser = await User.create(req.body)
                    roomToJoin.users.push(newUser)
                    await roomToJoin.save()
                    const users = roomToJoin.users.map(user => user.displayName)
                    req.io.to(req.body.accessCode).emit('newPlayer', req.body.displayName)
                    res.status(201).json({
                        message: 'User successfully created',
                        displayName: newUser.displayName,
                        accessCode: roomToJoin.accessCode,
                        joined: true,
                        users,
                    })
                }
            } else {
                res.json({
                    message: 'Room closed',
                    joined: false,
                })
            }
        } else {
            res.status(400).json({
                joined: false,
                message: 'Invalid room',
            })
        }
    } catch (err) {
        const d = new Date()
        console.log(`${d.toLocaleString()}: Error joining room:`)
        console.log(err)
        res.status(400).json({
            message: 'Error joining room'
        })
    }
})

module.exports = router