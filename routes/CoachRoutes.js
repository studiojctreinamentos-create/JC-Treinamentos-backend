const express = require('express')
const router = express.Router()

const authenticate = require('../middleware/auth')
const CoachController = require('../controller/CoachController')

router.post('/login', CoachController.login)
router.post('/register', authenticate, CoachController.register)
router.get('/coach/:id', authenticate, CoachController.findById)
router.get('/verify-token', authenticate, CoachController.verifyToken)

module.exports = router