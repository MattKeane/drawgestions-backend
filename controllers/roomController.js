const express = require('express')

const Room = require('../models/room')

const router = express.Router()

router.get('/new', async (req, res) => {
    try {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let desiredAccessCode = ''
        while (desiredAccessCode.length < 4) {
            const randomChoice = Math.floor(Math.random() * 26)
            desiredAccessCode += alphabet[randomChoice]
            if (desiredAccessCode.length === 4) {
                const checkCode = await Room.findOne({ accessCode: desiredAccessCode})
                if (checkCode) {
                    desiredAccessCode = ''
                } else {
                    const createdRoom = await Room.create({
                        accessCode: desiredAccessCode,
                    })
                    res.json({
                        accessCode: desiredAccessCode
                    })
                }
            }
        }
    } catch (err) {
        const d = new Date()
        console.log(`${d.toLocaleString()}: Error creating a room`)
        console.log(err)
        res.json({
            message: 'Error creating room'
        })
    }
})

module.exports = router