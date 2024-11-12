const BaseController = require('./BaseController')
const ScheduleConfig = require('../models/ScheduleConfig')
const Config = require('../models/Config')
const Session = require('../models/Session')
const { get } = require('curl')

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

            if (!scheduleConfig || scheduleConfig.length === 0) {
                console.log(`Nenhuma configuração de horário encontrada para o dia ${dayOfWeek}`);
                return;
            }

            const configMaxTrainee = this.getMaxTrainee()

            const sessions = scheduleConfig.map(schedule => ({
                maxTrainee: configMaxTrainee,
                time: schedule.time,
                scheduleId: scheduleId
            }));

            await Session.bulkCreate(sessions);
            console.log("Sessões criadas com sucesso")
        } catch (err) {
            console.error("Unable to add sessions:", err.message);
        }
    }

    async createSessionByNewScheduleConfig(newScheduleConfig, nextSchedules, option = {}) {
        try {

            const maxTrainee = await this.getMaxTrainee() 

            const sessions = nextSchedules.map(schedule => ({
                maxTrainee: maxTrainee,
                time: newScheduleConfig.time,
                scheduleId: schedule.id
            }))

            return await Session.bulkCreate(sessions, {transaction: option.transaction})

        } catch (error) {
            console.error("error:" + error.message)
        }
    }

    async getMaxTrainee(){
        const configMaxTrainee = await Config.findOne({
            where: { key: "MaxTrainee" }
        });

        if (!configMaxTrainee) {
            console.log("Configuração de MaxTrainee não encontrada");
            throw new Error("MaxTrainee not exists");
        }

        return configMaxTrainee.value;
    }
}

module.exports = new SessionController()