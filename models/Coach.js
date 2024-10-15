const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');

class Coach extends Model {}

Coach.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Coach'
});

module.exports = Coach;
