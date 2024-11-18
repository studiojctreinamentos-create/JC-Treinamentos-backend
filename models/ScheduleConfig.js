const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');


class ScheduleConfig extends Model {}

ScheduleConfig.init({
  day: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  isActived: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'ScheduleConfig'
});

module.exports = ScheduleConfig;