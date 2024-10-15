const express = require('express')
const router = express.Router()
const CoachController = require('../controller/CoachController')

router.post('/', CoachController.create.bind(CoachController))
router.get('/', CoachController.findAll.bind(CoachController))
router.get('/:id', CoachController.findById.bind(CoachController))
router.put('/:id', CoachController.update.bind(CoachController))
router.delete('/:id', CoachController.delete.bind(CoachController))

module.exports = router