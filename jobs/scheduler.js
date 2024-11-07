const cron = require('node-cron')
const scheduleController = require('../controller/ScheduleController')

cron.schedule('0 0 1 * *', scheduleController.ensure90DaysOfSchedules)

module.exports = {}