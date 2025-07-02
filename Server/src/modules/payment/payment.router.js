const auth = require('../../middleware/auth.middleware');
const paymentCtrl = require('./payment.controller');

const paymentRoute = require('express').Router();

paymentRoute.post("/bluebook/:id", auth, paymentCtrl.payTax)
paymentRoute.post("/verify/:id",auth, paymentCtrl.verifyTransaction)
module.exports = paymentRoute