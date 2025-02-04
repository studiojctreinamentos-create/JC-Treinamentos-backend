const { Sequelize } = require("sequelize");
const { sequelize, PaymentPlan, Trainee } = require("../models/");
const BaseController = require("./BaseController");

class PaymentPlanController extends BaseController {
  constructor() {
    super(PaymentPlan);
  }

  async findAll(req, res) {
    try {

      const {paranoid} = req.query

      const paymentPlans = await PaymentPlan.findAll({
        attributes: {
          include: [
            [
              Sequelize.fn("COUNT", Sequelize.col("Trainees.id")),
              "traineeCount"
            ],
          ],
        },
        include: [
          {
            model: Trainee,
            attributes: [],
          },
        ],
        group: ['PaymentPlan.id'],
        order: [['name']],
        paranoid: paranoid === "false" ? false : true,
      })
      res.status(200).json(paymentPlans);
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  }

  async update(req, res) {
    const transaction = await PaymentPlan.sequelize.transaction();
    try {
      const oldData = await PaymentPlan.findByPk(req.params.id, { transaction });
      if (!oldData) {
        throw new Error("Invalid ID");
      }
      const rawData = req.body

      const data = {
        name: rawData.name,
        value: rawData.value,
        numberDaysPerWeek: rawData.numberDaysPerWeek,
        billingInterval: rawData.billingInterval,
        description: rawData.description
      };

      data.version = oldData.version + 1;
      data.originalId = oldData.originalId;

      const newRecord = await PaymentPlan.create(data, { transaction });

      console.log("plano de pagamento criado")
      console.log(newRecord)

      await this.updateTraineePaymentPlan(oldData.id, newRecord.id, transaction);

      await oldData.destroy({ transaction });

      await transaction.commit();
      res.status(200).json(newRecord);
    } catch (e) {
      await transaction.rollback();
      console.error(e)
      res.status(500).json({ error: e.message });
    }
  }

  async create(req, res) {
    try {
      const newPlan = await PaymentPlan.create(req.body);

      newPlan.originalId = newPlan.id;
      await newPlan.save();

      res.status(201).json(newPlan);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async delete(req, res) {
    try {
      const trainees = await Trainee.findAll({
        where: {
          PaymentPlanId: req.params.id,
        },
      });

      if (trainees.length === 0) {
        await super.delete(req, res);
        return;
      }

      res.status(402).json({
        erro: "Existem trainees associados a este plano de pagamento.",
        existisTrainees: true
      });
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }

  async updateTraineePaymentPlan(oldId, newId, transaction) {
    const trainees = await Trainee.findAll({
      where: {
        PaymentPlanId: oldId,
      },
      transaction,
    });
  
    for (const trainee of trainees) {
      trainee.paymentPlanId = newId;
      await trainee.save({ transaction });
    }
  }
}

module.exports = new PaymentPlanController();
