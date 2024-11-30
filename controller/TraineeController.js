const BaseController = require("./BaseController");
const {Trainee, TraineeSessionConfig, PaymentPlan} = require("../models/");
const paymentController = require("./PaymentController");
const sequelize = require("../connection/db");
const { Json } = require("sequelize/lib/utils");
const {Op} = require('sequelize')



class TraineeController extends BaseController {
  constructor() {
    super(Trainee);
  }

  async create(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const trainee = req.body

      if(await this.checkUniqueTrainee(trainee)){
        await transaction.rollback();
        return res.status(500).json({message: "Este aluno já está cadastrado. Tente usar um nome diferente."})
      }

      const newTrainee = await Trainee.create(trainee, { transaction });

      const newPayment = await paymentController.createPaymentForTrainee(
        newTrainee,
        { transaction }
      );

      await transaction.commit();

      res.status(201).json({
        trainee: newTrainee,
        payment: newPayment,
        message: "Trainee created with initial payment record",
      });
    } catch (e) {
      await transaction.rollback();
      res.status(500).json({ message: e.message });
    }
  }

  async findWithScheduleData(req, res) {
    try {
      const { name, filter } = req.query;

      let filters = {};

      if (filter) filters = Json.parse(filter);
      if (name) filters.name = { [Op.like]: `%${name}%` };

      const trainees = await Trainee.findAll({
        include: [
          {
          model: PaymentPlan,
          attributes: ['name', 'value', 'numberDaysPerWeek', 'billingInterval', 'description']
        },
        {
          model: TraineeSessionConfig,
          attributes: ['time', 'dayOfWeek']
          
        }
      ],
        where: filters,
        order:[ ['isActive', 'DESC']]
        
      });

      res.status(200).json(trainees)

    } catch (error) {
      console.error("Erro ao buscar trainees:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async checkUniqueTrainee(trainee) {
    const existingTrainee = await Trainee.findOne({ where: { name: trainee.name } });
    console.log(existingTrainee !== null)
    return existingTrainee !== null; // Retorna `true` se o trainee já existe, `false` caso contrário
  }
}

module.exports = new TraineeController();
