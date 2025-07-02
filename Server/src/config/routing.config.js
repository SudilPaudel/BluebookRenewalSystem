const mainRouter = require('express').Router();
const authRouter = require('../modules/auth/authRouter');
const blueBookRoute = require('../modules/Bluebook/bluebook.router');
const paymentRoute = require('../modules/payment/payment.router');

mainRouter.use('/auth', authRouter)
mainRouter.use('/bluebook', blueBookRoute)
mainRouter.use('/payment', paymentRoute)


module.exports = mainRouter;