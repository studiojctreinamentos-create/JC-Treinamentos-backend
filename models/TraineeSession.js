const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class TraineeSession extends Model {}

  TraineeSession.init(
    {
      attendance: {
        type: DataTypes.BOOLEAN,
        defaultValue: null,
      },
      isRecurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      traineeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Trainees",
          key: "id",
        },
      },
      sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Sessions",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "TraineeSession",
      indexes: [
        {
          unique: true,
          fields: ["traineeId", "sessionId"],
        },
      ],
    }
  );

  return TraineeSession;
};
