const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');

class Schedule extends Model {}

Schedule.init({
  date: {
    type: DataTypes.DATEONLY,
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
