const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const Trainee = require('../models/Trainee');
const PaymentPlan = require('../models/PaymentPlan');

class Payment extends Model {}

Payment.init({
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'Payment'
});

Payment.belongsTo(Trainee, { foreignKey: 'traineeId' });
Payment.belongsTo(PaymentPlan, { foreignKey: 'paymentPlanId' });

module.exports = Payment;