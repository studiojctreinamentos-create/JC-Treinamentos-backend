const { Model, DataTypes } = require("sequelize");
const sequelize = require("../connection/db");
const Trainee = require("./Trainee");
const Schedule = require("./Schedule");

class Session extends Model {}

Session.init(
  {
    maxTrainee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Schedule,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Session",
  }
);

Session.belongsToMany(Trainee, { through: "TraineeSession" });

Session.belongsTo(Schedule, { foreignKey: "scheduleId" });

module.exports = Session;
