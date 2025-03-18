const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class TraineeSessionConfig extends Model {}

  TraineeSessionConfig.init(
    {
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      dayOfWeek: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      traineeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Trainees",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "TraineeSessionConfig",
    }
  );

  return TraineeSessionConfig;
};
