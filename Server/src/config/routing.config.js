const express = require('express');
const mainRouter = express.Router();

const authRouter = require('../modules/auth/auth.router');
const blueBookRouter = require('../modules/Bluebook/bluebook.router');
const adminRouter = require('../modules/admin/admin.router');
const paymentRouter = require('../modules/payment/payment.router');
const newsRouter = require('../modules/news/news.router');

mainRouter.use('/auth', authRouter);
mainRouter.use('/bluebook', blueBookRouter);
mainRouter.use('/admin', adminRouter);
mainRouter.use('/payment', paymentRouter);
mainRouter.use('/news', newsRouter);

module.exports = mainRouter;
