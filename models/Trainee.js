const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const PaymentPlan = require('./PaymentPlan');


class Trainee extends Model {}

Trainee.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  emergencyContact: {
    type: DataTypes.STRING
  },
  paymentDay:{
    type: DataTypes.INTEGER
  },
  address: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Trainee'
});

Trainee.belongsTo(PaymentPlan, { foreignKey: 'paymentPlanId' });


module.exports = Trainee;
