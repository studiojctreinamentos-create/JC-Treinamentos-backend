const BaseController = require("./BaseController");
const {Config} = require("../models/");
const DefaultConfig = require("../config/config");
const ScheduleConfigController = require("./ScheduleConfigController");

class ConfigController extends BaseController {
  constructor() {
    super(Config);
  }

  async createDefault() {
    try {
      const configCount = await Config.count();

      if (configCount === 0) {
        await Config.bulkCreate(DefaultConfig);
        console.log("configs padrão adicionadas");
      }
    } catch (e) {
      console.error("error:" + e.message);
    }
  }

  async createDefaultConfigs() {
    await this.createDefault();
    await ScheduleConfigController.createDefault();
  }
}

module.exports = new ConfigController();
