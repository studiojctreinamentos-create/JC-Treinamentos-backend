const BaseController = require('./BaseController')
const ScheduleConfig = require('../models/ScheduleConfig')

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
}

module.exports = new ScheduleConfigController()