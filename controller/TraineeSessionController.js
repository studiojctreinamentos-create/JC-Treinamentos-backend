const BaseController = require('./BaseController')
const Trainee = require('../models/Trainee')
const TraineeSession= require('../models/TraineeSession')
const Session = require('../models/Session')
const ScheduleConfig = require('../models/ScheduleConfig')
const Schedule = require('../models/Schedule')
const { Op } = require('sequelize')
const {startOfDay} = require('date-fns')

// rodrigo - quinta-feira - 8:00 - é recorrente

// Rodrigo Deve ter uma sessão todas as quintas feiras apartir de hoje as 8hrs

// Onde - weekDay = 4 -- Session -> Schedule
// Onde - time = 8:00 -- Session

// Rodrigo tem aula

// Criar Sessões para rodrigo baseado na session onde horario é 8:00 e schedule está relacionado com weekDay = 4.

// TraineeSession 

// Trainee = rodrigo

// Session = time: 8:00 -> Schedule: { weekDay: 4, day: 21/11}

// CriarSessõesParaRodrigo( RodrigoId, Session) 

// Crio sessão baseado nessa, e para cada session onde time: 8:00 schedule.weekday = 4. e session.schedule.date > lastSession crio traineeSchedule.create(RodrigoId, session)

// LastSession = buscar uma TraineeSession (primeira) - ordenada descrecente via traineeSession.session.schedule.date 

// [segunda-16:00, terça-9:00, quinta-8:00] - rodrigo 






class TraineeSessionController extends BaseController{
    constructor() {
        super(TraineeSession)
    }

    async createRecorringTraineeSession(traineeId, dayOfWeek, time){
        try {
            const date = startOfDay(new Date());
            console.log(time)
            const sessions = await Session.findAll(
                {
                    include: {
                        model: Schedule,
                        where: {
                            weekDay: dayOfWeek,
                            date:{[Op.gte] : date}
                        }
                    },
                    where: {
                        time: time
                    }
                }
            )

            console.log(sessions)


            const traineeSessions = sessions.map(session => ({
                traineeId: traineeId,
                sessionId: session.id,
            }))

            console.log(traineeSessions)

            
        } catch (error) {
            console.error("message:"+ error.message)
        }

    }

    async createTraineeSessionRecorringForAllTrainees(){


        await this.createRecorringTraineeSession(1, 1, "06:00:00")

        // try {
        //     const traineeSessions = await this.findRecurringTraineeSessionsWithDayAndTime()

        //     if(traineeSessions.length === 0){
        //         console.log("There is no recurring traineeSessions")
        //         return
        //     }

        //     const traineeSessionformated = traineeSessions.map(traineeSession => ({
        //         id: traineeSession.id,
        //         traineeId: traineeSession.traineeId,
        //         weekDay: traineeSession.Session.Schedule.weekDay,
        //         time: traineeSession.Session.time,
        //         date: traineeSession.Session.Schedule.date,
        //         attendance: traineeSession.attendance,
        //     })) 
        //     console.log(traineeSessionformated)

            


        // } catch (error) {
        //     console.error("message:" + error.message)
        // }
    }

    async findRecurringTraineeSessionsWithDayAndTime(){
        try {
            return await TraineeSession.findAll({
                include: {
                    model: Session,
                    required: true,
                    include: {
                        model: Schedule,
                        attributes: ['weekDay', 'date']
                    },
                    attributes: ['time']
                },
                where: {
                    isRecurring: true
                }
            })
   
        } catch (error) {
            console.error("message:" + error.message)
            return []
        }
    }
}

module.exports = new TraineeSessionController()