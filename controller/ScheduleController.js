const BaseController = require("./BaseController");
const TraineeSessionController = require("./TraineeSessionController");
const SessionController = require("./SessionController");
const {Session, Trainee, TraineeSession, Schedule} = require("../models")
const {
  addDays,
  format,
  differenceInCalendarDays,
  subDays,
  startOfDay,
  subHours
} = require("date-fns");
const { Op } = require("sequelize");
const sequelize = require("../connection/db");

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

  async findNearSessions(req, res) {
    try {
      const today = (new Date());
      const now = format(today, 'HH:mm:ss');
      const past = format(subHours(today, 1), 'HH:mm:ss');
    
      const actualSession = await Schedule.findOne({
        include: [
          {
            model: Session,
            attributes: ['time'],
            include: [
              {
                model: TraineeSession,
                attributes: ['id'],
                include: [
                  {
                    model: Trainee,
                    attributes: ['id', 'name'],
                  },
                ],
              },
            ],
            where: {
              time: { 
                [Op.or]:[ 
                  {[Op.between]: [past, now] },
                  {[Op.gte]: now},
              ]},
            },
            limit: 1,
          },
        ],
        attributes: ['id'],
        where: {
          date: { [Op.gte]: today },
        },
        logging: console.log,
      });

      const lastSession = await Schedule.findOne({
        include: [
          {
            model: Session,
            attributes: ['time'],
            include: [
              {
                model: TraineeSession,
                attributes: ['id'],
                include: [
                  {
                    model: Trainee,
                    attributes: ['id', 'name'],
                  },
                ],
              },
            ],
            where: {
              time: { [Op.lt]: past },
            },
            order: [['time', 'DESC']],
            limit: 1,
          },
        ],
        attributes: ['id'],
        where: {
          date: today ,
        },
        logging: console.log,
      });

      const nextSession = actualSession ? await Schedule.findOne({
        include: [
          {
            model: Session,
            attributes: ['time'],
            include: [
              {
                model: TraineeSession,
                attributes: ['id'],
                include: [
                  {
                    model: Trainee,
                    attributes: ['id', 'name'],
                  },
                ],
              },
            ],
            where: {
              time: { [Op.gt]: now },
            },
            limit: 1,
          },
        ],
        attributes: ['id'],
        where: {
          date: today,
        },
        logging: console.log,
      }): null;

      const sessions = {
        actualSession: actualSession.Sessions[0] || {},
        lastSession: lastSession.Sessions[0] || {},
        nextSession:  nextSession.Sessions[0] || {},
      }
    
      return res.status(200).json(sessions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
  
 async ensure90DaysOfSchedules() {
  try {
    const today = startOfDay(new Date());

    const lastSchedule = await Schedule.findOne({
      order: [["date", "DESC"]],
    });

    const lastDate = lastSchedule
      ? startOfDay(new Date(lastSchedule.date))
      : today;

    const TARGET_DAYS = 60;
    const daysRemaining =
      TARGET_DAYS - differenceInCalendarDays(lastDate, today);

    if (daysRemaining <= 0) return;

    await sequelize.transaction(async (transaction) => {
      await this.addWorkDaysFrom(lastDate, daysRemaining, { transaction });
    });

    await TraineeSessionController.createRecorrentTraineeSession();

  } catch (err) {
    console.error("Erro ao garantir schedules futuros:", err);
  }
}

 async addWorkDaysFrom(startDate, daysToAdd, { transaction } = {}) {
  const schedules = [];
  let currentDate = startOfDay(startDate);

  while (daysToAdd > 0) {
    currentDate = addDays(currentDate, 1);

    schedules.push({
      date: format(currentDate, "yyyy-MM-dd"),
      weekDay: currentDate.getDay(),
    });

    daysToAdd--;
  }

  try {
    if (schedules.length === 0) return;

    const createdSchedules = await Schedule.bulkCreate(
      schedules,
      {
        transaction,
        returning: true,
        ignoreDuplicates: true,
      }
    );

    for (const schedule of createdSchedules) {
      await SessionController.createSessionToSchedule(
        schedule.weekDay,
        schedule.id,
        { transaction }
      );
    }

  } catch (error) {
    console.error("Erro ao adicionar schedules:", error);
    throw error;
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
