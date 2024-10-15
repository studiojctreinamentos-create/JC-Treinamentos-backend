const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');

class Admin extends Model {}

Admin.init({
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
  modelName: 'Admin'
});

module.exports = Admin;