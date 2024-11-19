const cron = require("node-cron");
const scheduleController = require("../controller/ScheduleController");

cron.schedule("0 0 1 * *", async () => {
  try {
    await scheduleController.ensure90DaysOfSchedules();
  } catch (error) {
    console.error("Erro ao executar tarefas agendadas:", error);
  }
});

module.exports = {};
