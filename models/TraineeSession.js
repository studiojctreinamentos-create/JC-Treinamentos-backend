const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const Trainee = require('./Trainee');
const Session = require('./Session');

class TraineeSession extends Model {}

TraineeSession.init({
  attendance: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize,
  modelName: 'TraineeSession'
});

TraineeSession.belongsTo(Trainee, { foreignKey: 'traineeId' });
TraineeSession.belongsTo(Session, { foreignKey: 'sessionId' });

module.exports = TraineeSession;
