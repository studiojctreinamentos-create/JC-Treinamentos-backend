const BaseController = require("./BaseController");
const TraineeSessionController = require("./TraineeSessionController");
const SessionController = require("./SessionController");
const {
  addDays,
  format,
  differenceInCalendarDays,
  startOfDay,
} = require("date-fns");
const {Schedule} = require("../models/");
const { Op } = require("sequelize");

class ScheduleController extends BaseController {
  constructor() {
    super(Schedule);
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

    while (daysToAdd > 0) {
      currentDate = addDays(currentDate, 1);

      if (currentDate.getDay() !== 0) {
        schedules.push({
          date: format(currentDate, "yyyy-MM-dd"),
          weekDay: currentDate.getDay(),
        });
        daysToAdd--;
      }
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
