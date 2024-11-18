const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');


class Config extends Model {}

Config.init({
  key: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Config'
});

module.exports = Config;