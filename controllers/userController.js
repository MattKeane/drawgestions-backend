const express = require('express')
const User = require('../models/user')
const Room = require('../models/room')

const router = express.Router()

router.post('/new', async (req, res) => {
    try {
        const roomToJoin = await Room.findOne({ accessCode: req.body.accessCode }).populate('users')
        if (roomToJoin) {
            if (roomToJoin.users.some(user => user.displayName === req.body.displayName)) {
                res.json({
                    message: 'Username already taken'
                })
            } else {
                const newUser = await User.create({
                    displayName: req.body.displayName
                })
                roomToJoin.users.push(newUser)
                await roomToJoin.save()
                const users = roomToJoin.users.map(user => user.displayName)
                res.json({
                    message: 'User successfully created',
                    displayName: newUser.displayName,
                    accessCode: roomToJoin.accessCode,
                    users,
                })
            }
        } else {
            res.status(400).json({
                message: 'Invalid room'
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