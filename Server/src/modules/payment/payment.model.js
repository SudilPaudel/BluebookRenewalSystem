const mongoose = require("mongoose");


const PaymentSchema = new mongoose.Schema({
    paymentMethod:{
        type: String,
        enum: ['khalti','esewa'],
        require: true
    },
    paymentStatus:{
        type: String,
        enum:['pending','paid'],
        default:'pending'
    },
    status: {
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending'
    },
    amount: {
        type: Number,
        require: true
    },
    transactionId: {
        type: String,
        default: null,
        sparse: true
    },
    pidx:{
        type: String,
        unique: false,
        require: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: true
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    },
    updatededBy:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiresAt: {
        type: Date,
        default: null
    }
},
{
    timestamps: true,
    autoCreate: true,
    autoIndex: true
})

// Create a compound index that only applies when transactionId is not null
PaymentSchema.index({ transactionId: 1 }, { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { transactionId: { $type: "string" } }
});

const PaymentModel = mongoose.model("Payment", PaymentSchema)

module.exports = PaymentModel;