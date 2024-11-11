const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const Trainee = require('../models/Trainee');
const PaymentPlan = require('../models/PaymentPlan');

class Payment extends Model {}

Payment.init({
  paymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  traineeId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
        model: 'Trainees', 
        key: 'id' 
    }
  },
  paymentPlanId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
        model: 'PaymentPlan', 
        key: 'id' 
    }
  }
}, {
  sequelize,
  modelName: 'Payment'
});

Payment.belongsTo(Trainee, { foreignKey: 'traineeId' });
Payment.belongsTo(PaymentPlan, { foreignKey: 'paymentPlanId' });

module.exports = Payment;