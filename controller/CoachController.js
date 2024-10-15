const BaseController = require('./BaseController')
const Coach = require('../models/Coach')

class CoachController extends BaseController{
    constructor() {
        super(Coach)
    }
}

module.exports = new CoachController()