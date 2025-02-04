const BaseController = require("./BaseController");
const { Trainee, TraineeSessionConfig, PaymentPlan } = require("../models/");
const paymentController = require("./PaymentController");
const sequelize = require("../connection/db");
const { Op } = require('sequelize');

class TraineeController extends BaseController {
  constructor() {
    super(Trainee);
  }

  async create(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const trainee = req.body;

      if (await this.checkUniqueTrainee(trainee)) {
        return res.status(500).json({ message: "Este aluno já está cadastrado. Tente usar um nome diferente." });
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

      if (filter) filters = JSON.parse(filter);
      if (name) filters.name = { [Op.like]: `%${name}%` };

      const trainees = await Trainee.findAll({
        include: [
          {
            model: PaymentPlan,
            attributes: ['name', 'value', 'numberDaysPerWeek', 'billingInterval', 'description'],
          },
          {
            model: TraineeSessionConfig,
            attributes: ['time', 'dayOfWeek'],
          },
        ],
        where: filters,
        order: [['isActive', 'DESC'], ['name']],
      });

      res.status(200).json(trainees);
    } catch (error) {
      console.error("Erro ao buscar trainees:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }

  async tradeStatus(req, res) {
    const transaction = await Trainee.sequelize.transaction();

    try {
      const id = req.params.id;
      const trainee = await Trainee.findOne({ where: { id } });

      if (!trainee) {
        return res.status(404).json({ message: "Trainee não encontrado" });
      }

      const newStatus = !trainee.isActive;

      const [updatedRowCount] = await Trainee.update(
        { isActive: newStatus },
        { where: { id }, transaction }
      );

      const traineeUpdated = await Trainee.findOne({ where: { id }, transaction});

      if (newStatus) {
        const newPayment = await paymentController.createPaymentForTrainee(traineeUpdated, {transaction});
        console.warn(`new payment created ${newPayment}`);
      }

      if (updatedRowCount === 0) {
        await transaction.rollback();
        return res.status(500).json({ message: "Erro ao atualizar o status" });
      }

      await transaction.commit();
      return res.status(200).json({ message: `Status do trainee atualizado para ${newStatus ? 'ativo' : 'inativo'}` });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async checkUniqueTrainee(trainee) {
    const existingTrainee = await Trainee.findOne({ where: { name: trainee.name } });
    return existingTrainee !== null;
  }
}

module.exports = new TraineeController();
