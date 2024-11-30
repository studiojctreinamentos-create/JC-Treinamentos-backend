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
          model: "Trainees",  // Certifique-se de que o modelo Trainee esteja disponível
          key: "id",
        },
      },
      paymentPlanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "PaymentPlans",  // Certifique-se de que o modelo PaymentPlan esteja disponível
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
