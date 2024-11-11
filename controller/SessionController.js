const BaseController = require('./BaseController')
const ScheduleConfig = require('../models/ScheduleConfig')
const Config = require('../models/Config')
const Session = require('../models/Session')

class SessionController extends BaseController{
    constructor() {
        super(Session)
    }

    async createSessionToSchedule(dayOfWeek, scheduleId) {
        try {
            // Buscar as configurações de horários para o dia especificado
            const scheduleConfig = await ScheduleConfig.findAll({
                where: { day: dayOfWeek }
            });


    
            // Verificar se as configurações de horário foram encontradas
            if (!scheduleConfig || scheduleConfig.length === 0) {
                console.log(`Nenhuma configuração de horário encontrada para o dia ${dayOfWeek}`);
                return;
            }
    
            // Buscar a configuração de "MaxTrainee"
            const configMaxTrainee = await Config.findOne({
                where: { key: "MaxTrainee" }
            });
    
            // Verificar se a configuração de "MaxTrainee" foi encontrada
            if (!configMaxTrainee) {
                console.log("Configuração de MaxTrainee não encontrada");
                return;
            }
    
            // Criar os objetos de sessão
            const sessions = scheduleConfig.map(schedule => ({
                maxTrainee: configMaxTrainee.value,
                time: schedule.time,
                scheduleId: scheduleId
            }));
    
            // Criar as sessões no banco de dados
            await Session.bulkCreate(sessions);
            console.log("Sessões criadas com sucesso")
        } catch (err) {
            console.error("Unable to add sessions:", err.message);
        }
    }
}

module.exports = new SessionController()