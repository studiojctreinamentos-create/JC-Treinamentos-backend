const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');

class Schedule extends Model {}

Schedule.init({
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  time: {
    type: DataTypes.STRING,
    allowNull: false
  },
  weekDay: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Schedule'
});

module.exports = Schedule;
