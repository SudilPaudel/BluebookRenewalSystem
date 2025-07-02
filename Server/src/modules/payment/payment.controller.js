const bluebookCtrl = require('../Bluebook/bluebook.controller');
const BluebookModel = require('../Bluebook/bluebook.model');
const bluebookSvc = require('../Bluebook/bluebook.service');
const TaxModel = require('../Tax/tax.model');
const PaymentModel = require('./payment.model');
const axios = require('axios')

require('dotenv').config();

class PaymentController {
    payTax = async (req, res, next) => {
        try {
            const id = req.params.id
            //fetch bluebook data 
            const bluebookData = await bluebookSvc.findOneBluebook({
                _id: id
            })
            //bluebook ko status pennding vaye 
            if (!bluebookData.status === "pending") {
                res.status(400).json({
                    message: "Your bluebook is not verified",
                    meta: null
                })
            }

            //Days left logic 
            const now = new Date(); // current date
            const taxExpireDate = new Date(bluebookData.taxExpireDate); // parse the ISO string

            const diffInMs = taxExpireDate.getTime() - now.getTime(); // time difference in ms
            const daysLeft = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // convert ms to days

            let baseTax;
            let renewalCharge;
            //for bike 
            if (bluebookData.vehicleType === "Motorcycle") {
                renewalCharge = 300
                if (bluebookData.vehicleEngineCC <= 125) {
                    baseTax = 3000;
                } else if (bluebookData.vehicleEngineCC <= 150) {
                    baseTax = 5000;
                } else if (bluebookData.vehicleEngineCC <= 225) {
                    baseTax = 6500
                } else if (bluebookData.vehicleEngineCC <= 400) {
                    baseTax = 12000
                } else if (bluebookData.vehicleEngineCC <= 650) {
                    baseTax = 25000
                } else {
                    baseTax = 3600
                }
            }
            //for car
            else if (bluebookData.vehicleType === "Car") {
                renewalCharge = 500
                if (bluebookData.vehicleEngineCC <= 1000) {
                    baseTax = 22000;
                } else if (bluebookData.vehicleEngineCC <= 1500) {
                    baseTax = 25000;
                } else if (bluebookData.vehicleEngineCC <= 2000) {
                    baseTax = 27000
                } else if (bluebookData.vehicleEngineCC <= 2500) {
                    baseTax = 37000
                } else if (bluebookData.vehicleEngineCC <= 3000) {
                    baseTax = 50000
                } else if (bluebookData.vehicleEngineCC <= 3500) {
                    baseTax = 65000

                } else if (bluebookData.vehicleEngineCC >= 3501) {
                    baseTax = 70000
                }
            }

            let data;
            let totalTaxAmount = 0

            const today = new Date();
            const registrationDate = new Date(bluebookData.VehicleRegistrationDate);

            // Calculate year difference
            const vehicleAgeInYears = today.getFullYear() - registrationDate.getFullYear();
            let oldVehicleTax = 0;
            const { paymentMethod } = req.body
            const paymentData = await PaymentModel.create({
                paymentMethod: paymentMethod,
                createdBy: req.authUser
            })

            //Conditions for the tax 
            if (daysLeft < 30 && daysLeft > 1) {
                totalTaxAmount = baseTax + renewalCharge;
                if (vehicleAgeInYears >= 15) {
                    // 10% extra tax for old vehicles
                    oldVehicleTax = 0.10 * totalTaxAmount;
                    totalTaxAmount += oldVehicleTax;
                }
                const TaxData = await TaxModel.create({
                    baseTax: baseTax,
                    renewalCharge: renewalCharge,
                    oldVehicleTax: oldVehicleTax || 0,
                    TotalTaxAmount: totalTaxAmount
                })
                if (paymentData.paymentMethod === "khalti") {
                    data = {
                        return_url: "http://localhost:9005",
                        purchase_order_id: TaxData._id,
                        amount: totalTaxAmount * 100, //Khalti dont accept in rupee so convert it to paisa 
                        website_url: "http://localhost:9005/",
                        purchase_order_name: `Order-${TaxData.id}`
                    }
                }
                const response = await axios.post('https://dev.khalti.com/api/v2/epayment/initiate/', data, {
                    headers: {
                        'Authorization': 'key 583b0022d828403aa655b2ed39ccaed7'
                    }
                })
                const KhaltiPaymentResponse = response.data
                paymentData.pidx = KhaltiPaymentResponse.pidx
                paymentData.save()
                res.status(200).json({
                    result: {
                        paymentData,
                        TaxData,
                        KhaltiPaymentResponse
                    },
                    payment: {
                        paymentURl: KhaltiPaymentResponse.paymeent_url,
                        expiresAt: KhaltiPaymentResponse.expires_at,
                    },
                    message: "Payment Initiated successfully",
                    meta: null
                })
            } 
            else if (daysLeft < 1) {
                let fineAmount = 0;
                if (daysLeft <= -365) {
                    fineAmount = 0.20 * baseTax;
                } else if (daysLeft <= -45) {
                    fineAmount = 0.10 * baseTax;
                } else if (daysLeft <= -1) {
                    fineAmount = 0.05 * baseTax;
                }
                totalTaxAmount = baseTax + renewalCharge + fineAmount;
                if (vehicleAgeInYears >= 15) {
                    // 10% extra tax for old vehicles
                    oldVehicleTax = 0.10 * totalTaxAmount;
                    totalTaxAmount += oldVehicleTax;
                }
                const TaxData = await TaxModel.create({
                    baseTax: baseTax,
                    renewalCharge: renewalCharge,
                    fineAmount: fineAmount,
                    oldVehicleTax: oldVehicleTax,
                    TotalTaxAmount: totalTaxAmount
                })
                


                if (paymentData.paymentMethod === "khalti") {
                    data = {
                        return_url: "http://localhost:9005",
                        purchase_order_id: TaxData._id,
                        amount: totalTaxAmount * 100, //Khalti dont accept in rupee so convert it to paisa 
                        website_url: "http://localhost:9005/",
                        purchase_order_name: `Order-${TaxData.id}`
                    }
                }
                const response = await axios.post('https://dev.khalti.com/api/v2/epayment/initiate/', data, {
                    headers: {
                        'Authorization': 'key 583b0022d828403aa655b2ed39ccaed7'
                    }
                })
                const KhaltiPaymentResponse = response.data
                paymentData.pidx = KhaltiPaymentResponse.pidx
                paymentData.save()
                res.status(200).json({
                    result: {
                        paymentData,
                        TaxData,
                        KhaltiPaymentResponse
                    },
                    payment: {
                        paymentURl: KhaltiPaymentResponse.paymeent_url,
                        expiresAt: KhaltiPaymentResponse.expires_at,
                    },
                    message: "Payment Initiated successfully",
                    meta: null
                })


            }
            else if(daysLeft > 30) {
                res.json({
                    message: "You have time to pay your vehicle tax"
                })
            }
            else{
                res.status(500).json({
                    message: "500 Internal Server Error"
                })
            }

        }
        catch (exception) {
            next(exception)
        }
    }
    verifyTransaction = async (req, res, next) => {
        try {
            const { pidx } = req.body
            const { id } = req.params
            const userId = req.authUser
            if (!pidx) {
                res.status(400).json({
                    message: "Please Provide the pidx"
                })
                return;
            }
            const response = await axios.post('https://dev.khalti.com/api/v2/epayment/lookup/', {
                pidx
            }, {
                headers: {
                    "Authorization": "key 583b0022d828403aa655b2ed39ccaed7"
                }
            })
            const data = response.data;
            const today = new Date();
            const oneYearLater = new Date(today);
            oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
            if (data.status === "Completed") {
                await PaymentModel.updateOne({
                    pidx: pidx,
                }, {
                    $set: { paymentStatus: 'paid' }
                })
                await BluebookModel.updateOne({
                    _id: id
                }, {
                    $set: {
                        taxPayDate: today,
                        taxExpireDate: oneYearLater
                    }
                })

                res.status(200).json({
                    result: {
                        totalAmount: data.total_amount / 100,
                        transactionId: data.transaction_id,
                        fee: data.fee,
                        refunded: data.refunded
                    },
                    message: "Transaction is verified successfully",
                    meta: null
                })
            } else {
                res.status(400).json({
                    message: "This payment is not verified",
                    meta: null
                })
            }
        } catch (exception) {
            next(exception)
        }
    }
}

const paymentCtrl = new PaymentController();
module.exports = paymentCtrl
