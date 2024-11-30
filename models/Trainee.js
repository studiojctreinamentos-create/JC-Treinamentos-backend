const { Model, DataTypes } = require("sequelize");
const { differenceInYears } = require('date-fns');

module.exports = (sequelize) => {
  class Trainee extends Model {}

  Trainee.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      age: {
        type: DataTypes.VIRTUAL,
        get() {
          const birthDate = this.getDataValue("birthDate");
          if (!birthDate) return null;
          return differenceInYears(new Date(), new Date(birthDate));
        },
      },
      cpf: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
      },
      emergencyContact: {
        type: DataTypes.STRING,
      },
      paymentDay: {
        type: DataTypes.INTEGER,
      },
      address: {
        type: DataTypes.STRING,
      },
      observations: {
        type: DataTypes.STRING,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      modelName: "Trainee",
    }
  );

  return Trainee;
};
