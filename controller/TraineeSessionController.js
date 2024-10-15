const BaseController = require('./BaseController')
const Trainee = require('../models/Trainee')

class TraineeController extends BaseController{
    constructor() {
        super(Trainee)
    }
}

module.exports = new TraineeController()