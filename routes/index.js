const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/auth');

const traineeRoutes = require('./TraineeRoutes');
const paymentRoutes = require('./PaymentRoutes');
const paymentPlanRoutes = require('./PaymentPlanRoutes');
const scheduleRoutes = require('./ScheduleRoutes');
const sessionRoutes = require('./SessionRoutes');
const coachRoutes = require('./CoachRoutes');
const traineeSessionRoutes = require('./TraineeSessionRoutes');

router.use('/', coachRoutes);

router.use('/trainees', authenticate, traineeRoutes);
router.use('/payments', authenticate, paymentRoutes);
router.use('/payment-plans', authenticate, paymentPlanRoutes);
router.use('/schedules', authenticate, scheduleRoutes);
router.use('/sessions', authenticate, sessionRoutes);
router.use('/trainee-sessions', authenticate, traineeSessionRoutes);

module.exports = router;