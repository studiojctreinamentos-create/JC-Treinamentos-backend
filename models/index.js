const { Sequelize } = require("sequelize");
const sequelize = require('../connection/db');

// Carregar modelos
const Coach = require("./Coach")(sequelize);
const Config = require("./Config")(sequelize);
const Payment = require("./Payment")(sequelize);
const PaymentPlan = require("./PaymentPlan")(sequelize);
const Trainee = require("./Trainee")(sequelize);
const Schedule = require("./Schedule")(sequelize);
const ScheduleConfig = require("./ScheduleConfig")(sequelize);
const Session = require("./Session")(sequelize);
const TraineeSession = require("./TraineeSession")(sequelize);
const TraineeSessionConfig = require("./TraineeSessionConfig")(sequelize);

// Configurar relacionamentos
Payment.belongsTo(Trainee, { foreignKey: "traineeId", onDelete: "CASCADE" }); // Um pagamento pertence a um trainee
Trainee.hasMany(Payment, { foreignKey: "traineeId" }); // Um trainee pode ter vários pagamentos

Payment.belongsTo(PaymentPlan, { foreignKey: "paymentPlanId" }); // Um pagamento pertence a um plano de pagamento
PaymentPlan.hasMany(Payment, { foreignKey: "paymentPlanId" }); // Um plano de pagamento pode ter vários pagamentos

Trainee.belongsTo(PaymentPlan, { foreignKey: 'paymentPlanId' }); // Um trainee tem um plano de pagamento
PaymentPlan.hasMany(Trainee, { foreignKey: 'paymentPlanId'  }); // Um plano de pagamento pode ter vários trainees

TraineeSession.belongsTo(Trainee, { foreignKey: "traineeId" }); // Uma sessão está associada a um trainee
Trainee.hasMany(TraineeSession, { foreignKey: "traineeId" }); // Um trainee pode ter várias sessões

TraineeSession.belongsTo(Session, { foreignKey: "sessionId" }); // Uma sessão está associada a uma aula
Session.hasMany(TraineeSession, { foreignKey: "sessionId" }); // Uma aula pode ter várias sessões associadas

TraineeSessionConfig.belongsTo(Trainee, { foreignKey: "traineeId" }); // Uma configuração de sessão pertence a um trainee
Trainee.hasMany(TraineeSessionConfig, { foreignKey: "traineeId" }); // Um trainee pode ter várias configurações de sessão

Session.belongsTo(Schedule, { foreignKey: "scheduleId" }); // Uma aula pertence a um cronograma
Schedule.hasMany(Session, { foreignKey: "scheduleId" }); // Um cronograma pode ter várias aulas


// Expor modelos e sequelize
module.exports = {
  Coach,
  Config,
  Payment,
  PaymentPlan,
  Trainee,
  Schedule,
  ScheduleConfig,
  Session,
  TraineeSession,
  TraineeSessionConfig,
};