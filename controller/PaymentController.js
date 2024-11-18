const { set, addMonths, parseISO } = require('date-fns');
const BaseController = require("./BaseController");
const sequelize = require('../connection/db')
const Payment = require("../models/Payment");
const Trainee = require('../models/Trainee');

class PaymentController extends BaseController {
    constructor() {
        super(Payment);
    }

    async getLastPaymentDate(traineeId) {
        try {
            const lastPayment = await Payment.findOne({
                where: { traineeId },
                order: [['paymentDate', 'DESC']]
            });
            return lastPayment ? parseISO(lastPayment.paymentDate.toISOString()) : null;
        } catch (err) {
            console.error('Erro ao obter o último pagamento:', err);
            throw err;
        }
    }

    async createPaymentData(trainee) {
        try {
            const lastPaymentDate = await this.getLastPaymentDate(trainee.id);
            const paymentDate = lastPaymentDate
                ? set(addMonths(lastPaymentDate, 1), { date: trainee.paymentDay })
                : set(new Date(), { date: trainee.paymentDay });
    
            return {
                paymentDate,
                traineeId: trainee.id,
                paymentPlanId: trainee.paymentPlanId
            };
        } catch (err) {
            console.error('Erro ao criar dados de pagamento:', err);
            throw err;
        }
    }
    
    async createPaymentForAllTrainees() {
        try {
            const trainees = await Trainee.findAll();
            if (!trainees.length) {
                console.log('Nenhum trainee encontrado');
                return;
            }

            const payments = await Promise.all(
                trainees.map(async trainee => await this.createPaymentData(trainee))
            );
            await Payment.bulkCreate(payments);
            console.log("Payments criados com sucesso");
        } catch (err) {
            console.error('Erro ao criar pagamentos para todos os trainees:', err);
        }
    }

    async createPaymentForTrainee(trainee, options = {}) {
        try {
            const paymentData = await this.createPaymentData(trainee);
            return await Payment.create(paymentData, { transaction: options.transaction });
        } catch (err) {
            console.error('Erro ao criar pagamento para o trainee:', err);
            throw err;
        }
    }

    async createPaymentByTraineeId(traineeId, options = {}) {
        try {
            const trainee = await Trainee.findByPk(traineeId, {transaction: options.transaction});
            if (!trainee) throw new Error('Trainee não encontrado');
            await this.createPaymentForTrainee(trainee, options.transaction);
        } catch (err) {
            console.error('Erro ao criar pagamento para o trainee por ID:', err);
            throw err;
        }
    }

    async updateStatusToTrue(req, res) {
        const transaction = await Payment.sequelize.transaction()

        try {
            const id = req.params.id;
            const [updatedRowCount] = await Payment.update(
                { status: true },
                { where: { id }, transaction}
            );

            if (updatedRowCount === 0) {
                await transaction.rollback()
                return res.status(404).json({ message: "Pagamento não encontrado" });
            }

            const updatedPayment = await Payment.findByPk(id, {transaction});
            if (!updatedPayment) {
                await transaction.rollback()
                return res.status(404).json({ message: "Pagamento não encontrado após atualização" });
            }

            const traineeId = updatedPayment.traineeId;
    
            await this.createPaymentByTraineeId(traineeId, {transaction});

            await transaction.commit()

            res.status(200).json({ message: "Status atualizado com sucesso" });
        } catch (e) {
            await transaction.rollback()
            res.status(500).json({ message: e.message });
        }
    }
}

module.exports = new PaymentController();
