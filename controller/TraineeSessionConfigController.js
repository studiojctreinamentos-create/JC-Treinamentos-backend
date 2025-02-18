const sequelize = require("../connection/db");
const BaseController = require("./BaseController");
const TraineeSessionController = require("./TraineeSessionController");
const {TraineeSessionConfig} = require("../models/");

class TraineeSessionConfigController extends BaseController {
  constructor() {
    super(TraineeSessionConfig);
  }

  async create(req, res) {
    const transaction = await sequelize.transaction();

    try {
        const newRecord = await TraineeSessionConfig.create(req.body, {
            transaction,
        });

        await TraineeSessionController.createRecorrentTraineeSession({ transaction });

        await transaction.commit();

        return res.status(201).json({
            message: "Registro criado com sucesso e sessões recorrentes associadas!",
            data: newRecord,
        });
    } catch (error) {

        await transaction.rollback();

        console.error("Erro ao criar registro:", error.message);

        return res.status(500).json({
            message: "Erro ao criar o registro.",
            error: error.message,
        });
    }
}



  async delete(req, res) {
    const transaction = await TraineeSessionConfig.sequelize.transaction();
    try {
        const config = await TraineeSessionConfig.findByPk(req.params.id);

        if (!config) {
            throw new Error('Config not found.');
        }

        await TraineeSessionController.deleteTraineeSessionByConfig(config, { transaction });

        await config.destroy({transaction})

        await transaction.commit();
        res.status(200).json({ message: "Data was successfully deleted." });
    } catch (error) {
        if (transaction) await transaction.rollback();
        res.status(500).json({ message: error.message });
    }
}

async checkTraineeSessionConfig(req, res) {
  try {
    const {traineeId, dayOfWeek, time} = req.query
    const traineeSession = await TraineeSessionConfig.findOne({
      where: {
        traineeId: traineeId,
        dayOfWeek: dayOfWeek,
        time: time
      },
      attributes: ['id']
    })

    if(traineeSession){
      return res.status(200).json({exists: true, id: traineeSession.id})
    }
    return res.status(200).json({exists: false})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
}

}

module.exports = new TraineeSessionConfigController();
