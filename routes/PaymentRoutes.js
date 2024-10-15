const express = require('express')
const Payment = require('../controller/PaymentController')
const router = express.Router()

router.post('/', Payment.create.bind(Payment))
router.get('/', Payment.findAll.bind(Payment))
router.get('/:id', Payment.findById.bind(Payment))
router.put('/:id', Payment.update.bind(Payment))
router.delete('/:id', Payment.delete.bind(Payment))

module.exports = router