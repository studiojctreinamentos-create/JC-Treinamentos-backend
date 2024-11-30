const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Config extends Model {}

  Config.init(
    {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Config",
    }
  );

  return Config;
};
