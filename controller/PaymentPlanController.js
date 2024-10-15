const PaymentPlan = require("../models/PaymentPlan");
const BaseController = require("./BaseController");
const Trainee = require("../models/Trainee");

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
            const newPlan = await PaymentPlan.create({
                ...req.body,
                version: 0,
                originalId: null // Inicializando o originalId
            });

            // Atualiza o originalId para ser igual ao ID recém-criado
            newPlan.originalId = newPlan.id;
            await newPlan.save();

            res.status(201).json(newPlan);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    async updateTraineePaymentPlan(oldId, newId) {
        const trainees = await Trainee.findAll({
            where: {
                PaymentPlanId: oldId,
            }
        });

        for (const trainee of trainees) {
            trainee.paymentPlanId = newId;
            await trainee.save();
            console.log(trainee)
        }
    }
}

module.exports = new PaymentPlanController();
