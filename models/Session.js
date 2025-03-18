const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Session extends Model {}

  Session.init(
    {
      maxTrainee: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      scheduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Schedules",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Session",
    }
  );

  return Session;
};
