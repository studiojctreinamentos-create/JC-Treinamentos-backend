const BaseController = require('./BaseController')
const Config = require('../models/Config')

class ConfigController extends BaseController{
    constructor() {
        super(Config)
    }
}

module.exports = new ConfigController()