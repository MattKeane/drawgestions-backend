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
        res.status(400).json({
            message: 'Error creating room'
        })
    }
})

router.get('/join/:accessCode', async (req, res) => {
    try {
        const roomToJoin = await Room
            .findOne({ accessCode: req.params.accessCode })
            .populate('users')
        if (roomToJoin) {
            const users = roomToJoin.users.map(user => user.displayName)
            res.status(200).json({
                accessCode: roomToJoin.accessCode,
                users,
            })
        } else {
            res.status(400).json({
                message: 'Invalid Access Code'
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