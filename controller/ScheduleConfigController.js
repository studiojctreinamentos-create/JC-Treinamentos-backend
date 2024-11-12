const sequelize = require('../connection/db')
const BaseController = require('./BaseController')
const ScheduleConfig = require('../models/ScheduleConfig')
const scheduleDefaultConfig = require('../config/scheduleConfigData')
const Schedule = require('../models/Schedule')
const SessionController = require('./SessionController')
const { Op } = require('sequelize')
const { startOfDay } = require('date-fns');
const Config = require('../models/Config')

class ScheduleConfigController extends BaseController{
    constructor() {
        super(ScheduleConfig)
    }

    async createMany(req, res){
        try{
            const configs = req.body

            if(!configs){
                throw Error("data not exists")
            }
            await ScheduleConfig.bulkCreate(configs)
            res.status(201).json({ message: "Items created successfully" });

        }catch(err){
            res.status(500).json({message: "impossible to create items:" + err.message})
        }
    }

    async createDefault(){
        try{
            const scheduleCount = await Schedule.count()

            if(scheduleCount === 0) {
                await ScheduleConfig.bulkCreate(scheduleDefaultConfig)
                console.log("Dados padrão de schedule foram inseridos.");
            }
            
        }catch(e){
            console.error("error:" + e.message)
        }
    }

    async create(req, res){
        const transaction = await ScheduleConfig.sequelize.transaction()
        try {

            const today = startOfDay(new Date());
    
            const configCreated = await ScheduleConfig.create(req.body, {transaction})

            const schedules = await Schedule.findAll({
                where: {
                    date: {
                        [Op.gte]: today
                    },
                    weekDay: configCreated.day,
                }
            })


            const sessionsCreated = await SessionController.createSessionByNewScheduleConfig(configCreated, schedules, transaction)

            await transaction.commit()
            console.log("Agendamentos adicionados com sucesso")
            res.status(200).json([{message: "schedule and session created with sucess"}, {sessions: sessionsCreated}, {configs: configCreated}])
        } catch (error) {  
            await transaction.rollback()
            res.status(500).json({message: error.message})
        }
    }
}

module.exports = new ScheduleConfigController()