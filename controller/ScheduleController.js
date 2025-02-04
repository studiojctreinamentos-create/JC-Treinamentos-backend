const BaseController = require("./BaseController");
const TraineeSessionController = require("./TraineeSessionController");
const SessionController = require("./SessionController");
const {Session, Trainee, TraineeSession, Schedule} = require("../models")
const {
  addDays,
  format,
  differenceInCalendarDays,
  startOfDay,
} = require("date-fns");
const { Op } = require("sequelize");

class ScheduleController extends BaseController {
  constructor() {
    super(Schedule);
  }

  async findAll(req, res){
    try {
      const { startDate, endDate, date } = req.query;

      const filters = {};

      if(date) {
        filters.date = {
          [Op.eq]: new Date(date)
        }
      } else if (startDate && endDate) {
        filters.date = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      } else if (startDate) {
        filters.date = {
          [Op.gte]: new Date(startDate),
        };
      } else if (endDate) {
        filters.date = {
          [Op.lte]: new Date(endDate),
        };
      }
  
      const schedules = await Schedule.findAll({
        include: [
          {
            model: Session,
            attributes: ['id','maxTrainee', 'time'],
            include: [
              {
                model:TraineeSession,
                attributes: ['id','isRecurring', 'attendance', 'id'],
                include: [
                  {
                    model: Trainee,
                    attributes: ['id','name']
                  }
                ]
              }
            ],
            
          },
          
        ],

        attributes: ['id','date', 'weekDay'],
        where: filters,
        order: [
          ['date', 'ASC'],
          ['weekDay', 'ASC'],
          [Session, 'time', 'ASC'],
        ],

        
      })
      
      const formattedSchedules = schedules.map(schedule => {
        return {
          id: schedule.id,
          date: schedule.date,
          weekDay: schedule.weekDay,
          Sessions: schedule.Sessions.map(session => {
            return {
              id: session.id,
              time: session.time,
              maxTrainee: session.maxTrainee,
              trainees: session.TraineeSessions.map(traineeSession => {
                return {
                  id: traineeSession.Trainee.id,
                  traineeSessionId: traineeSession.id,
                  name: traineeSession.Trainee.name,
                  isRecurring: traineeSession.isRecurring,
                  attendance: traineeSession.attendance,
                };
              }),
            };
          }),
        };
      });

      res.status(200).json(formattedSchedules);
    } catch (error) {
      console.error(error);
      res.status(500).json({message: error.message})
    }
  }

  async ensure90DaysOfSchedules() {
    try {
      const today = new Date();
      const lastSchedule = await Schedule.findOne({
        order: [["date", "DESC"]],
      });
      const lastDate = lastSchedule ? new Date(lastSchedule.date) : today;
      const daysRemaining = 90 - differenceInCalendarDays(lastDate, today);
      if (daysRemaining > 0) {
        await this.addWorkDaysFrom(lastDate, daysRemaining);
        await TraineeSessionController.createRecorrentTraineeSession();
      }
    } catch (err) {
      console.log("Erro ao garantir 90 dias de schedules futuros:", err);
    }
  }

  async addWorkDaysFrom(startDate, daysToAdd) {
    const schedules = [];
    let currentDate = startDate;

    while (daysToAdd > 1) {
      currentDate = addDays(currentDate, 1);

      schedules.push({
        date: format(currentDate, "yyyy-MM-dd"),
        weekDay: currentDate.getDay(),
      });
      daysToAdd--;
      
    }

    try {
      if (schedules.length > 0) {
        const createdSchedules = await Schedule.bulkCreate(schedules);

        for (const schedule of createdSchedules) {
          await SessionController.createSessionToSchedule(
            schedule.weekDay,
            schedule.id
          );
        }
      }
    } catch (error) {
      console.error("Erro ao adicionar schedules:", error);
    }
  }

  async findByDayOfWeekAndDate(dayOfWeek, date, options = {}) {
    try {
      const schedules = await Schedule.findAll({
        where: {
          weekDay: dayOfWeek,
          date: {
            [Op.gte]: date,
          },
        },
        transaction: options.transaction,
      });
      return schedules;
    } catch (error) {
      console.error("message:", error.message);
    }
  }
}
module.exports = new ScheduleController();
