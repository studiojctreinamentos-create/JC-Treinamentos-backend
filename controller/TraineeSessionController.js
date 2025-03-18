const BaseController = require("./BaseController");
const {TraineeSessionConfig, TraineeSession, Session, Schedule} = require("../models/");

const { Op } = require("sequelize");
const { startOfDay, subDays } = require("date-fns");

class TraineeSessionController extends BaseController {
  constructor() {
    super(TraineeSession);
  }

  async checkTraineeSession(req, res) {
    try {
      const { traineeId, sessionId } = req.query;
      const traineeSession = await TraineeSession.findOne({
        where: {
          traineeId: traineeId,
          sessionId: sessionId
        }
      });
  
      if (traineeSession) {
        return res.status(200).json({ exists: true });
      }
      return res.status(200).json({ exists: false });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async createRecorrentTraineeSession(options = {}) {
    const transaction = options.transaction;

    try {
        const configs = await TraineeSessionConfig.findAll({ transaction });
        const today = startOfDay(new Date());

        const traineeSessions = [];

        for (const config of configs) {
            const date = await this.getDateForLastTraineeSession(
                config.dayOfWeek,
                config.time,
                config.traineeId,
                { transaction }
            );

            const sessions = await Session.findAll({
                include: {
                    model: Schedule,
                    where: {
                        [Op.or]: [
                            { date: { [Op.gte]: date || today } },
                            { date: null }
                        ],
                        weekDay: config.dayOfWeek,
                    },
                    attributes: [],
                },
                where: {
                    time: config.time,
                },
                attributes: ["id"],
                transaction,
            });

            console.warn(sessions)

            sessions.forEach((session) => {
                traineeSessions.push({
                    traineeId: config.traineeId,
                    sessionId: session.id,
                    isRecurring: true,
                });
            });
        }

        if (traineeSessions.length > 0) {
            await TraineeSession.bulkCreate(traineeSessions, {
                ignoreDuplicates: true,
                transaction,
            });
        }
    } catch (error) {
        console.error(`Erro ao buscar configs: ${error.message}`);
        throw error; 
    }
}

async getDateForLastTraineeSession(dayOfWeek, time, traineeId, options = {}) {
  const transaction = options.transaction;

  try {
      const lastTrainee = await TraineeSession.findOne({
          include: {
              model: Session,
              include: {
                  model: Schedule,
                  attributes: ["date"],
                  where: {
                      weekDay: dayOfWeek,
                  },
              },
              where: {
                  time: time,
              },
          },
          where: {
              traineeId: traineeId,
          },
          order: [[Session, Schedule, "date", "DESC"]],
          attributes: [],
          transaction,
      });

      return lastTrainee?.Session?.Schedule?.date || null;
  } catch (error) {
      console.error(`Erro ao buscar última TraineeSession: ${error.message}`);
      throw error;
  }
}


  async deleteTraineeSessionByConfig(config, options = {}) {
    try {
      const yesterday = subDays(startOfDay(new Date()), 1);

      const sessions = await Session.findAll({
        include: {
          model: Schedule,
          where: {
            weekDay: config.dayOfWeek,
            date: { [Op.gt]: yesterday },
          },
          attributes: [],
        },
        where: {
          time: config.time,
        },
        attributes: ["id"],
      });

      if (!sessions || sessions.length === 0) {
        throw new Error("No sessions found with the provided config data.");
      }

      const sessionIds = sessions.map((session) => session.id);

      const deletedRows = await TraineeSession.destroy({
        where: {
          traineeId: config.traineeId,
          sessionId: {
            [Op.in]: sessionIds,
          },
        },
        transaction: options.transaction,
      });

      if (deletedRows === 0) {
        throw new Error("No rows were deleted.");
      }
    } catch (error) {
      throw new Error(`Error deleting trainee sessions: ${error.message}`);
    }
  }
}

module.exports = new TraineeSessionController();
