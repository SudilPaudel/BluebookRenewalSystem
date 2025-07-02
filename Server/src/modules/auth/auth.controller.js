require("dotenv").config();
const mailSvc = require('../../services/mail.service')
const authSvc = require('./auth.service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController{
    register = async(req,res, next)=>{
        try{
            const data = authSvc.transformRegisterData(req);
            const registeredData = await authSvc.createUser(data);
            await mailSvc.sendEmail(
                registeredData.email,
                "Activate your account - Bluebook Renewal System",
                `Dear ${registeredData.name}, <br />
                <p>You have successfully registered on Bluebook Renewal System with the citizenId: <strong>${registeredData.citizenshipNo}</strong>.</p><br/>
                <p>To activate your account, please click the link below:</p><br/>
                <a href="${process.env.FRONTEND_URL}/auth/activate/${registeredData.activationToken}">
                Click here to activate your account</a><br/>
                <p>If you did not register, please ignore this email.</p><br/>
                <p>Thank you!</p>
                <p> Regards, </p>
                <p>${process.env.SMTP_FROM}</p>
                <p><small>Please donot reply to this email via any mail service</small></p>
                `

            )
            res.json({
                result: registeredData,
                message: "User registered successfully. Please check your email to activate your account.",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
    }
    activate = async(req, res, next)=>{
        try{
            const {token}= req.params;
            const associatedUser = await authSvc.findOneUser({
                activationToken: token
            })
            if(!associatedUser){
                throw {code: 400, message: "token doesnot exists"}
            }
            const updatedResult = await authSvc.updateUser({
                activationToken: null,
                status: 'active'
            }, associatedUser._id)
            res.json({
                result: updatedResult,
                message: "Account activated successfully. You Can now login.",
                meta: null 
            })
        }catch(exception){
            next(exception);
        }
    }
    login = async(req, res, next)=>{
        try{
            const {email, password} = req.body;
            const userDetail = await authSvc.findOneUser({
                email: email
            })
            if(!userDetail){
                throw {code: 400, message: "User does not exists with this email"}
            }
            if(bcrypt.compareSync(password, userDetail.password)){
                if(userDetail.status !== 'active'){
                    throw {code: 400, message: "User account is not activated"}
                }
                const accessToken = jwt.sign({
                    sub: userDetail._id
                }, process.env.JWT_SECRET)
                const refreshToken = jwt.sign({
                    sub: userDetail._id
                }, process.env.JWT_SECRET, {
                    expiresIn: '7d'
                })
                res.json({
                    result: {
                        detail: {
                            _id: userDetail._id,
                            name: userDetail.name,
                            email: userDetail.email,
                            citizenshipNo: userDetail.citizenshipNo,
                            role: userDetail.role,
                            status: userDetail.status,
                            image: userDetail.image
                        },
                        tokens:{
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        }
                    },
                    message: "User Logged in Successfully",
                    meta: null
                })
            }
        }catch(exception){
            next(exception);
        }
    }
    getLoggedIn= async(req, res, next)=>{
        try{
            const loggedInUser = req.authUser;
            const response = {
                _id: loggedInUser._id,
                name: loggedInUser.name,
                email: loggedInUser.email,
                citizenshipNo: loggedInUser.citizenshipNo,
                role: loggedInUser.role,
                status: loggedInUser.status,
                image: loggedInUser?.image
            }
            res.json({
                result: response,
                message: "Your Profile",
                meata: null
            })
        }catch(exception){
            next(exception);
        }
    }
    getadminAccess = (req, res, next)=>{
        try{
            const data= req.authUser;
            res.json({
                result: data,
                message: "Success",
                meta: null
            })
        }catch(exception){
            next(exception)
        }
    }
}
const authCtrl = new AuthController();
module.exports = authCtrl;