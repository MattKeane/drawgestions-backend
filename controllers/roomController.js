const express = require('express')

const router = express.Router()

router.get('/new', (req, res) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let desiredAccessCode = ''
    while (desiredAccessCode.length < 4) {
        const randomChoice = Math.floor(Math.random() * 26)
        desiredAccessCode += alphabet[randomChoice]
    }
    res.json({
        accessCode: desiredAccessCode
    })
})

module.exports = router