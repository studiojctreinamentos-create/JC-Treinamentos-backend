const express = require('express')
const router = express.Router()

const authenticate = require('../middleware/auth')
const CoachController = require('../controller/CoachController')

router.post('/register', authenticate, CoachController.register)
router.post('/login', CoachController.login)

module.exports = router