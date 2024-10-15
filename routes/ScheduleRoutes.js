const express = require('express')
const router = express.Router()
const ScheduleController = require('../controller/ScheduleController')

router.post('/', ScheduleController.create.bind(ScheduleController))
router.get('/', ScheduleController.findAll.bind(ScheduleController))
router.get('/:id', ScheduleController.findById.bind(ScheduleController))
router.put('/:id', ScheduleController.update.bind(ScheduleController))
router.delete('/:id', ScheduleController.delete.bind(ScheduleController))

module.exports = router