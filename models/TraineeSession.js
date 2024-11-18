const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');

const Session = require('./Session');
const TraineeSessionConfig = require('./TraineeSessionConfig');

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
  traineeSessionConfigId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TraineeSessionConfig, 
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

TraineeSession.belongsTo(TraineeSessionConfig, { foreignKey: 'traineeSessionConfigId' });
TraineeSession.belongsTo(Session, { foreignKey: 'sessionId' });

module.exports = TraineeSession;
