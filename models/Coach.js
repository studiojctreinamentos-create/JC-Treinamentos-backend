const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Coach extends Model {}

  Coach.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Coach",
    }
  );

  return Coach;
};
