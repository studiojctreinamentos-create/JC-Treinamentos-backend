const BaseController = require('./BaseController')
const Trainee = require('../models/Trainee')
const TraineeSession= require('../models/TraineeSession')
const TraineeSessionConfig= require('../models/TraineeSessionConfig')
const Session = require('../models/Session')
const ScheduleConfig = require('../models/ScheduleConfig')
const Schedule = require('../models/Schedule')
const { Op } = require('sequelize')
const {startOfDay} = require('date-fns')

class TraineeSessionConfigController extends BaseController{
    constructor() {
        super(TraineeSessionConfig)
    }
}

module.exports = new TraineeSessionConfigController()