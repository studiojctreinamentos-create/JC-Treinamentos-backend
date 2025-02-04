const { set, addMonths, parseISO, toISOString } = require("date-fns");
const BaseController = require("./BaseController");
const sequelize = require("../connection/db");
const { Payment, Trainee, PaymentPlan } = require("../models/");
const { Op } = require("sequelize");

class PaymentController extends BaseController {
  constructor() {
    super(Payment);
  }

  async findAll(req, res) {
    try {
      const { startDate, endDate, status, traineeName } = req.query;
  
      let filters = {};
  
      if (startDate && endDate) {
        filters.paymentDate = {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        };
      } else if (startDate) {
        filters.paymentDate = {
          [Op.gte]: new Date(startDate),
        };
      } else if (endDate) {
        filters.paymentDate = {
          [Op.lte]: new Date(endDate),
        };
      }
  
      if (traineeName) {
        filters['$Trainee.name$'] = {
          [Op.like]: `%${traineeName}%`,
        };
      }
  
      if (status !== undefined) {
        filters.status = status;
      }
  
      const payments = await Payment.findAll({
        include: [
          {
            model: PaymentPlan,
            attributes: ["value", "billingInterval"],
            paranoid: false,
          },
          {
            model: Trainee,
            attributes: ["name"],
            where: traineeName
              ? {
                  name: {
                    [Op.like]: `%${traineeName}%`,
                  },
                }
              : undefined,
          },
        ],
        where: filters,
        order: [["status", "ASC"], ["paymentDate", "ASC"]],
      });
  
      res.status(200).json(payments);
    } catch (error) {
      console.error("Erro ao buscar pagamentos:", error);
      res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
  

  async getLastPaymentDate(traineeId) {
    try {
      const lastPayment = await Payment.findOne({
        where: { traineeId },
        order: [["paymentDate", "DESC"]],
      });
      return lastPayment
        ? parseISO(lastPayment.paymentDate)
        : null;
    } catch (err) {
      console.error("Erro ao obter o último pagamento:", err);
      throw err;
    }
  }

  async createPaymentData(trainee) {
    try {
      const lastPaymentDate = await this.getLastPaymentDate(trainee.id);
  
      const paymentPlan = await PaymentPlan.findByPk(trainee.paymentPlanId);
      if (!paymentPlan || !paymentPlan.billingInterval) {
        throw new Error("Plano de pagamento inválido ou intervalo de cobrança ausente");
      }
  
      const billingInterval = paymentPlan.billingInterval;
      const paymentDate = lastPaymentDate
        ? set(addMonths(lastPaymentDate, billingInterval), { date: trainee.paymentDay })
        : set(new Date(), { date: trainee.paymentDay });
  
      return {
        paymentDate,
        traineeId: trainee.id,
        paymentPlanId: trainee.paymentPlanId,
      };
    } catch (err) {
      console.error("Erro ao criar dados de pagamento:", err);
      throw err;
    }
  }

  async createPaymentForAllTrainees() {
    try {
      const trainees = await Trainee.findAll({
        where: {
          isActive: true,
        },
      });
      if (!trainees.length) {
        console.log("Nenhum trainee encontrado");
        return;
      }

      const payments = await Promise.all(
        trainees.map(async (trainee) => await this.createPaymentData(trainee))
      );
      await Payment.bulkCreate(payments);
      console.log("Payments criados com sucesso");
    } catch (err) {
      console.error("Erro ao criar pagamentos para todos os trainees:", err);
    }
  }

  async createPaymentForTrainee(trainee, options = {}) {
    try {
      if(trainee.isActive){
        const paymentData = await this.createPaymentData(trainee);
        return await Payment.create(paymentData, {
          transaction: options.transaction,
        });
      }
      console.warn(`trainee ${trainee.name} is inactive`)
    } catch (err) {
      console.error("Erro ao criar pagamento para o trainee:", err);
      throw err;
    }
  }

  async createPaymentByTraineeId(traineeId, options = {}) {
    try {
      const trainee = await Trainee.findByPk(traineeId, {
        transaction: options.transaction,
      });
      if (!trainee) throw new Error("Trainee não encontrado");
      await this.createPaymentForTrainee(trainee, options.transaction);
    } catch (err) {
      console.error("Erro ao criar pagamento para o trainee por ID:", err);
      throw err;
    }
  }

  async updateStatusToTrue(req, res) {
    const transaction = await Payment.sequelize.transaction();

    try {
      const id = req.params.id;
      const [updatedRowCount] = await Payment.update(
        { status: true },
        { where: { id }, transaction }
      );

      if (updatedRowCount === 0) {
        await transaction.rollback();
        return res.status(404).json({ message: "Pagamento não encontrado" });
      }

      const updatedPayment = await Payment.findByPk(id, { transaction });
      if (!updatedPayment) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ message: "Pagamento não encontrado após atualização" });
      }

      const traineeId = updatedPayment.traineeId;

      await this.createPaymentByTraineeId(traineeId, { transaction });

      await transaction.commit();

      res.status(200).json({ message: "Status atualizado com sucesso" });
    } catch (e) {
      await transaction.rollback();
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new PaymentController();
