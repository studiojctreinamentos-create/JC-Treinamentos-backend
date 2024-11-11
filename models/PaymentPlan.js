const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');

class PaymentPlan extends Model {}

PaymentPlan.init({
  originalId: {
    type: DataTypes.INTEGER
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  numberDaysPerWeek: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  billingInterval: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  description: {
    type: DataTypes.STRING
  },
  version: {
    type: DataTypes.INTEGER
  },
}, {
  sequelize,
  paranoid: true,
  modelName: 'PaymentPlan'
});

module.exports = PaymentPlan;
