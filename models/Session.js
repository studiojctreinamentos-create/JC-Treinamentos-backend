const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const Trainee = require('./Trainee');
const Schedule = require('./Schedule');

class Session extends Model {}

Session.init({
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  maxTrainee: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Session'
});

// Relacionamento muitos para muitos com Trainee
Session.belongsToMany(Trainee, { through: 'TraineeSession' });

Session.belongsTo(Schedule, { foreignKey: 'scheduleId' });

module.exports = Session;