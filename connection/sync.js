require('dotenv').config();

const sequelize = require('./db');
const ScheduleConfig = require('../models/ScheduleConfig')
const Config = require('../models/Config')
const Schedule = require('../models/Schedule');
const Session = require('../models/Session');
const Coach = require('../models/Coach');
const PaymentPlan = require('../models/PaymentPlan');
const Trainee = require('../models/Trainee');
const Payment = require('../models/Payment')
const TraineeSession = require('../models/TraineeSession');
const TraineeSessionConfig = require('../models/TraineeSessionConfig');


const ScheduleController = require('../controller/ScheduleController');
const ConfigController = require('../controller/ConfigController')

async function syncDatabase() {
  try {
    await sequelize.sync({force: false});
    await ConfigController.createDefaultConfigs.call(ConfigController);
    await ScheduleController.ensure90DaysOfSchedules();
    console.log('Banco de dados sincronizado.');
  } catch (error) {
    console.error('Erro ao sincronizar banco de dados:', error);
    throw error; 
  }
}

module.exports = syncDatabase;