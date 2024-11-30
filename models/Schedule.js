const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Schedule extends Model {}

  Schedule.init(
    {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      weekDay: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Schedule",
    }
  );

  return Schedule;
};
