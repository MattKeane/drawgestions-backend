const express = require('express')

const Room = require('../models/room')
const User = require('../models/user')

const router = express.Router()

router.post('/new', async (req, res) => {
    try {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let desiredAccessCode = ''
        while (desiredAccessCode.length < 4) {
            const randomChoice = Math.floor(Math.random() * 26)
            desiredAccessCode += alphabet[randomChoice]
            if (desiredAccessCode.length === 4) {
                const checkCode = await Room.findOne({ accessCode: desiredAccessCode })
                if (checkCode) {
                    desiredAccessCode = ''
                } else {
                    const createdRoom = await Room.create({
                        accessCode: desiredAccessCode,
                    })
                    res.status(201).json({
                        accessCode: desiredAccessCode
                    })
                }
            }
        }
    } catch (err) {
        const d = new Date()
        console.log(`${d.toLocaleString()}: Error creating a room`)
        console.log(err)
        res.status(400)json({
            message: 'Error creating room'
        })
    }
})

router.post('/join', async (req, res) => {
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
                res.json({
                    message: 'User successfully created'
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