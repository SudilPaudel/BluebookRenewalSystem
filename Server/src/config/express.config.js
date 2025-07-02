const express = require('express');
require('./db.connfig')
const Joi = require('joi');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

app.use(helmet());
app.use(cors());
const mainRouter = require('./routing.config')
const router = express.Router();

//Body parsers
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//Routes
router.get('/health',(req, res)=>{
    res.status(200).json({
        result: "Server is running",
        message: "Success Ok",
        meta: null
    })
})
app.use(router);
app.use(mainRouter)

//404 route 
app.use((error, req, res, next)=>{
    let statusCode = error.status || 500;
    let data= error.data || null;
    let message = error.message || "Internal Server Error";
    if(error instanceof Joi.ValidationError){
        statusCode = 422;
        message= "Validation Failed";
        data = {};
        const errorDetail = error.details
        if(Array.isArray(errorDetail)){
            errorDetail.map((errorObj)=>{
                data[errorObj.context.label]= errorObj.message;
            })
        }
    }
    if(statusCode === 11000){
        statusCode = 400
        data= {}
        const fields = Object.keys(error.keyPattern)
        fields.map((fieldname)=>{
            data[fieldname]= fieldname+" should be unique"
        })
        message = "Validation Error"
    }
    res.status(statusCode).json({
        result: data,
        message: message,
        meta: null
    })
})
module.exports = app;