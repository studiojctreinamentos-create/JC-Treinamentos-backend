const BaseController = require('./BaseController')
const {addDays, format, isWeekend, differenceInCalendarDays, getDay} = require('date-fns')
const Schedule = require('../models/Schedule')
const SessionController = require('./SessionController')


class ScheduleController extends BaseController{
    constructor() {
        super(Schedule)
    }

    async ensure90DaysOfSchedules(){
        try {
            const today = new Date()
            const lastSchedule = await Schedule.findOne({ order: [['date', 'DESC']]})
            const lastDate = lastSchedule ? new Date(lastSchedule.date) : today
            const daysRemaining = 90 - differenceInCalendarDays(lastDate, today)
            if(daysRemaining > 0){

                await this.addWorkdaysFrom(lastDate, daysRemaining)
            }

        }catch(err){
            console.log('Erro ao garantir 90 dias de schedules futuros:', err)
        }
    }

    async addWorkdaysFrom(startDate, daysToAdd){
        const schedules = []
        let currentDate = startDate

        while (daysToAdd > 0){
            currentDate = addDays(currentDate, 1)

            if(!isWeekend(currentDate)){
                schedules.push({
                    date: format(currentDate, 'yyyy-MM-dd'),
                    weekDay: currentDate.getDay()
                })
                daysToAdd--
            }
        }

        try{
            if(schedules.length > 0){
                const createdSchedules = await Schedule.bulkCreate(schedules)

                for(const schedule of createdSchedules){
                    await SessionController.createSessionToSchedule(schedule.weekDay, schedule.id)
                }
            }
        }catch(err){
            console.error('Erro ao adicionar schedules:', err)
        }
    }
}
module.exports = new ScheduleController()