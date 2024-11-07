const express = require('express')
const router = express.Router()
const Config = require('../controller/ConfigController')


router.post('/', Config.create.bind(Config))
router.get('/', Config.findAll.bind(Config))
router.get('/:id', Config.findById.bind(Config))
router.put('/:id', Config.update.bind(Config))
router.delete('/:id', Config.delete.bind(Config))

module.exports = router