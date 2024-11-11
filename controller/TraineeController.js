const BaseController = require('./BaseController')
const Trainee = require('../models/Trainee')
const paymentController = require('./PaymentController')
const sequelize = require('../connection/db')

class TraineeController extends BaseController{
    constructor() {
        super(Trainee)
    }

    async create(req, res){
        const transaction = await sequelize.transaction()

        try{
            const newTrainee = await Trainee.create(req.body, {transaction})

            const newPayment = await paymentController.createPaymentForTrainee(newTrainee, {transaction})

            await transaction.commit()

        res.status(201).json({
            trainee: newTrainee,
            payment: newPayment,
            message: "Trainee created with initial payment record"
        })

        }catch(e){
            await transaction.rollback()
            res.status(500).json({message: e.message})
        }
    }
}

module.exports = new TraineeController()