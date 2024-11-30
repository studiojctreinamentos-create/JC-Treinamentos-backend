const sequelize = require("../connection/db");
const BaseController = require("./BaseController");
const TraineeSessionController = require("./TraineeSessionController");
const {TraineeSessionConfig} = require("../models/");

class TraineeSessionConfigController extends BaseController {
  constructor() {
    super(TraineeSessionConfig);
  }

  async create(req, res) {
    await super.create(req, res);
    TraineeSessionController.createRecorrentTraineeSession();
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

}

module.exports = new TraineeSessionConfigController();
