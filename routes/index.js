const express = require('express')
const router = express.Router()

const traineeRoutes = require('./TraineeRoutes')
const paymentRoutes = require('./PaymentRoutes')
const paymentPlanRoutes = require('./PaymentPlanRoutes')
const scheduleRoutes = require('./ScheduleRoutes')
const sessionRoutes = require('./SessionRoutes')
const adminRoutes = require('./AdminRoutes')
const coachRoutes = require('./CoachRoutes')
const traineeSessionRoutes = require('./TraineeSessionRoutes')

router.use('/trainee', traineeRoutes)
router.use('/payment', paymentRoutes)
router.use('/paymentPlan', paymentPlanRoutes)
router.use('/schedule', scheduleRoutes)
router.use('/session', sessionRoutes)
router.use('/admin', adminRoutes)
router.use('/coach', coachRoutes)
router.use('/traineeSession', traineeSessionRoutes)




module.exports = router