const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class ScheduleConfig extends Model {}

  ScheduleConfig.init(
    {
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      isActived: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "ScheduleConfig",
    }
  );

  return ScheduleConfig;
};
