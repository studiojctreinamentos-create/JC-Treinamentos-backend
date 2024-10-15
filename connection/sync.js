require('dotenv').config();
const sequelize = require('./db');
const Trainee = require('../models/Trainee');
const PaymentPlan = require('../models/PaymentPlan');
const Payment = require('../models/Payment')
const Coach = require('../models/Coach');
const Admin = require('../models/Admin');
const Session = require('../models/Session');
const TraineeSession = require('../models/TraineeSession');
const Schedule = require('../models/Schedule');

async function syncDatabase() {
  try {
    await sequelize.sync({force: false});
    console.log('Banco de dados sincronizado.');
  } catch (error) {
    console.error('Erro ao sincronizar banco de dados:', error);
    throw error; 
  }
}

module.exports = syncDatabase;