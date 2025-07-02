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
    pidx:{
        type: String,
        unique: false,
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
    }
},
{
    timestamps: true,
    autoCreate: true,
    autoIndex: true
}
)

const PaymentModel = mongoose.model("Payment", PaymentSchema)

module.exports = PaymentModel;