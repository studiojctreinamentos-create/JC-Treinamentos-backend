const express = require('express')
const PaymentPlan = require('../controller/PaymentPlanController')
const router = express.Router()

router.post('/', PaymentPlan.create.bind(PaymentPlan))
router.get('/', PaymentPlan.findAll.bind(PaymentPlan))
router.get('/:id', PaymentPlan.findById.bind(PaymentPlan))
router.put('/:id', PaymentPlan.update.bind(PaymentPlan))
router.delete('/:id', PaymentPlan.delete.bind(PaymentPlan))

module.exports = router