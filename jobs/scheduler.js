const cron = require('node-cron')
const scheduleController = require('../controller/ScheduleController')
const paymentController = require('../controller/PaymentController')

// Funções executadas todo primeiro dia do mês a meia-noite
cron.schedule('0 0 1 * *', async() => {
    try {
        // await paymentController.createPaymentForAllTrainees();
        await scheduleController.ensure90DaysOfSchedules();
    } catch (error) {
        console.error("Erro ao executar tarefas agendadas:", error);
    }
} )

// cron.schedule('*/30 * * * * *', async() => {
//     try {
//         await paymentController.createPaymentForAllTrainees();
//         await scheduleController.ensure90DaysOfSchedules();
//     } catch (error) {
//         console.error("Erro ao executar tarefas agendadas:", error);
//     }
// } )

module.exports = {}