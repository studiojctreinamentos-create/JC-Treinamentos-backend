const BaseController = require('./BaseController')
const Schedule = require('../models/Schedule')

class ScheduleController extends BaseController{
    constructor() {
        super(Schedule)
    }
}

module.exports = new ScheduleController()