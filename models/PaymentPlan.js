const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class PaymentPlan extends Model {}

  PaymentPlan.init({
    originalId: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    numberDaysPerWeek: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    billingInterval: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    description: {
      type: DataTypes.STRING
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    paranoid: true,
    modelName: 'PaymentPlan',
  });

  return PaymentPlan;
};
