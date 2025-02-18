const sequelize = require("../connection/db");
const BaseController = require("./BaseController");
const {ScheduleConfig, Schedule} = require("../models/");
const scheduleDefaultConfig = require("../config/scheduleConfigData");
const ScheduleController = require("./ScheduleController");
const SessionController = require("./SessionController");
const { Op } = require("sequelize");
const { startOfDay, format } = require("date-fns");

class ScheduleConfigController extends BaseController {
  constructor() {
    super(ScheduleConfig);
  }
  async createMany(req, res) {
    try {
      const configs = req.body;

      if (!configs) {
        throw Error("data not exists");
      }
      await ScheduleConfig.bulkCreate(configs);
      res.status(201).json({ message: "Items created successfully" });
    } catch (err) {
      res
        .status(500)
        .json({ message: "impossible to create items:" + err.message });
    }
  }

  async createDefault() {
    try {
      const scheduleCount = await Schedule.count();

      if (scheduleCount === 0) {
        await ScheduleConfig.bulkCreate(scheduleDefaultConfig);
        console.log("Dados padrão de schedule foram inseridos.");
      }
    } catch (e) {
      console.error("error:" + e.message);
    }
  }

  async create(req, res) {
    const transaction = await ScheduleConfig.sequelize.transaction();
    try {
      const today = startOfDay(new Date());

      const configCreated = await ScheduleConfig.create(req.body, {
        transaction,
      });

      const schedules = await Schedule.findAll({
        where: {
          date: {
            [Op.gte]: today,
          },
          weekDay: configCreated.day,
        },
      });

      const sessionsCreated =
        await SessionController.createSessionByNewScheduleConfig(
          configCreated,
          schedules,
          transaction
        );

      await transaction.commit();
      console.log("Agendamentos adicionados com sucesso");
      res
        .status(200)
        .json([
          { message: "schedule and session created with sucess" },
          { sessions: sessionsCreated },
          { configs: configCreated },
        ]);
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ message: error.message });
    }
  }

  async findIdByDayAndTime (req, res) {
    try {
      const {day, time} = req.query

      const schedule = await ScheduleConfig.findOne({
        where: {
          day: day,
          time: time
        },
        attributes: ['id']
      })

      res.status(200).json({id: schedule.id})

    } catch (error) {
      res.status(500).json({error: error.message})
    }
  }

  async delete(req, res) {
    const transaction = await ScheduleConfig.sequelize.transaction();
    try {
      const config = await ScheduleConfig.findByPk(req.params.id);

      const today = startOfDay(new Date());
      const data = req.body;

      const dayOfWeek = config.day;
      const time = config.time;

      const date = data.date ? new Date(data.date) : today;
      const UTCDate = date.setUTCHours(12, 0, 0, 0);
      const formatedDate = format(UTCDate, "yyyy-MM-dd");

      const schedules = await ScheduleController.findByDayOfWeekAndDate(
        dayOfWeek,
        formatedDate,
        transaction
      );
      const scheduleIds = schedules.map((schedule) => schedule.id);

      await SessionController.destroySessionsFromTimeAndSchedulesId(
        time,
        scheduleIds,
        transaction
      );

      await config.destroy({ transaction });

      await transaction.commit();
      res
        .status(200)
        .json({ message: "configs and sessions deleted with sucess" });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ScheduleConfigController();
