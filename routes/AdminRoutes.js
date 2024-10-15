const express = require('express')
const router = express.Router()
const AdminController = require('../controller/AdminController')

router.post('/', AdminController.create.bind(AdminController))
router.get('/', AdminController.findAll.bind(AdminController))
router.get('/:id', AdminController.findById.bind(AdminController))
router.put('/:id', AdminController.update.bind(AdminController))
router.delete('/:id', AdminController.delete.bind(AdminController))

module.exports = router