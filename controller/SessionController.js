const BaseController = require("./BaseController");
const {ScheduleConfig, Config, Session, Schedule} = require("../models/");
const { Op, Sequelize } = require("sequelize");

class SessionController extends BaseController {
  constructor() {
    super(Session);
  }

  async create(req, res){
    const transaction = await Session.sequelize.transaction()
    try {
      console.log(req.body)
      const schedule = await Schedule.findOne({
        where: {
          date: req.body.date
        },
        attributes: ['id'],
        transaction: transaction
      })

      console.log(schedule.id)

      const data = {
        scheduleId: schedule.id,
        time: req.body.time,
        maxTrainee: req.body.maxTrainee,
      }

      const newSession = await Session.create(data, {
        transaction: transaction,
      });

      await transaction.commit()
      res.status(201).json(newSession);
    } catch (e) {
      await transaction.rollback()
      res.status(500).json({ error: e.message });
    }
  }

  async createSessionToSchedule(dayOfWeek, scheduleId) {
    try {
      const scheduleConfig = await ScheduleConfig.findAll({
        where: { day: dayOfWeek },
      });

      if (!scheduleConfig || scheduleConfig.length === 0) {
        console.log(
          `Nenhuma configuração de horário encontrada para o dia ${dayOfWeek}`
        );
        return;
      }

      const maxTrainee = await this.getMaxTrainee();

      const sessions = scheduleConfig.map((schedule) => ({
        maxTrainee: maxTrainee,
        time: schedule.time,
        scheduleId: scheduleId,
      }));

      await Session.bulkCreate(sessions);
      console.log("Sessões criadas com sucesso");
    } catch (err) {
      console.error("Unable to add sessions:", err.message);
    }
  }

  async createSessionByNewScheduleConfig(
    newScheduleConfig,
    nextSchedules,
    option = {}
  ) {
    try {
      const maxTrainee = await this.getMaxTrainee();

      const sessions = nextSchedules.map((schedule) => ({
        maxTrainee: maxTrainee,
        time: newScheduleConfig.time,
        scheduleId: schedule.id,
      }));

      return await Session.bulkCreate(sessions, {
        transaction: option.transaction,
      });
    } catch (error) {
      console.error("error:" + error.message);
    }
  }

  async getMaxTrainee() {
    const configMaxTrainee = await Config.findOne({
      where: { key: "MaxTrainee" },
    });

    if (!configMaxTrainee) {
      console.log("Configuração de MaxTrainee não encontrada");
      throw new Error("MaxTrainee not exists");
    }

    return configMaxTrainee.value;
  }

  async destroySessionsFromTimeAndSchedulesId(time, schedulesIds, options = {}) {
    try {
        const session = await Session.destroy({
        where: {
          time: time,
          scheduleId: {
            [Op.in]: schedulesIds,
          },
        },
        transaction: options.transaction,
      });
    } catch (error) {
      console.error("error:" + error.message);
      throw Error("Não foi possivel excluir as seções")
    }
  }
}

module.exports = new SessionController();
