"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Schedules", {
      fields: ["date", "weekDay"],
      type: "unique",
      name: "unique_schedule_date_weekday",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Schedules",
      "unique_schedule_date_weekday"
    );
  },
};