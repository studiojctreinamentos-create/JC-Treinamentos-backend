const {PaymentPlan, Trainee} = require("../models/");
const BaseController = require("./BaseController");


class PaymentPlanController extends BaseController {
  constructor() {
    super(PaymentPlan);
  }

  async update(req, res) {
    try {
      const oldData = await PaymentPlan.findByPk(req.params.id);
      if (!oldData) {
        throw new Error("Invalid ID");
      }
      const data = req.body;
      data.version = oldData.version + 1;
      data.originalId = oldData.originalId;

      const newRecord = await PaymentPlan.create(data);
      await this.updateTraineePaymentPlan(oldData.id, newRecord.id);
      await oldData.destroy();

      res.status(200).json(newRecord);
    } catch (e) {
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

      res.status(500).json({
        erro: "Existem trainees associados a este plano de pagamento.",
      });
    } catch (error) {
      res.status(500).json({ erro: error.message });
    }
  }
  async updateTraineePaymentPlan(oldId, newId) {
    const trainees = await Trainee.findAll({
      where: {
        PaymentPlanId: oldId,
      },
    });

    for (const trainee of trainees) {
      trainee.paymentPlanId = newId;
      await trainee.save();
      console.log(trainee);
    }
  }
}

module.exports = new PaymentPlanController();
