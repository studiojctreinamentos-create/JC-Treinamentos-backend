const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/db');
const Trainee = require('./Trainee');
const Session = require('./Session');

class TraineeSessionConfig extends Model {}

TraineeSessionConfig.init({
  time:{
    type: DataTypes.STRING,
    allowNull: false
  },
  dayOfWeek:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  traineeId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Trainee, 
      key: 'id' 
    }
  },
}, {
  sequelize,
  modelName: 'TraineeSessionConfig'
});

TraineeSessionConfig.belongsTo(Trainee, { foreignKey: 'traineeId' });

module.exports = TraineeSessionConfig;
