const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Payment extends Model {}

  Payment.init(
    {
      paymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
      paymentPlanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "PaymentPlans", 
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );
  return Payment;
};
