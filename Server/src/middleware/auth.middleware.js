require('dotenv').config()
const jwt = require("jsonwebtoken");
const authSvc = require('../modules/auth/auth.service');
const auth = async(req, res, next)=>{
    try{
        let token = req.headers['authorization'] || null;
        if(!token){
            next({code: 401, message: "Token is required"})
        }
        token = token.split(" ").pop()
        //token verify
        //sign and expiry, formatting
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        const userDetail = await authSvc.findOneUser({
            _id: tokenData.sub
        })
        if(!userDetail){
            next({code:400, message: "User does not exists anymore"})
        }
        req.authUser = userDetail;
        next()// allow the user to access
    }catch(exception){
        console.log("Exception", exception)
        next({code: 401, message: "Unauthorized Access"})
    }
}

module.exports = auth;