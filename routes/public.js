const express = require('express')
const path = require('path')
const router = express.Router()

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

router.get('/trainee', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/trainee.html'))
} )

router.get('/check', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/check.html'))
} )

module.exports = router