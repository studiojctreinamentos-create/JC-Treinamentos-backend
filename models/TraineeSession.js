const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');

const Session = require('./Session');
const TraineeSessionConfig = require('./TraineeSessionConfig');
const Trainee = require('./Trainee');

class TraineeSession extends Model {}

TraineeSession.init({
  attendance: {
    type: DataTypes.BOOLEAN,
    defaultValue: null
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  traineeId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Trainee, 
      key: 'id' 
    }
  },
  sessionId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Session, 
      key: 'id' 
    }
  }
}, {
  sequelize,
  modelName: 'TraineeSession'
});

TraineeSession.belongsTo(Trainee, { foreignKey: 'traineeId' });
TraineeSession.belongsTo(Session, { foreignKey: 'sessionId' });

module.exports = TraineeSession;
