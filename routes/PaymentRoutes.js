const express = require('express')
const Payment = require('../controller/PaymentController')
const router = express.Router()

router.get('/', Payment.findAll.bind(Payment))
router.get('/:id', Payment.findById.bind(Payment))
router.put('/:id', Payment.update.bind(Payment))
router.delete('/:id', Payment.delete.bind(Payment))

router.put('/status-to-true/:id', Payment.updateStatusToTrue.bind(Payment))

module.exports = router