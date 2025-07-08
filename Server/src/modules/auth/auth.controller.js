require("dotenv").config();
const mailSvc = require('../../services/mail.service')
const authSvc = require('./auth.service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController{
    // Handles user registration, generates OTP, sends verification email, and returns registration info.
    register = async(req,res, next)=>{
        try{
            const data = authSvc.transformRegisterData(req);
            
            // Generate OTP for email verification
            const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
            data.emailOtp = emailOtp;
            data.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            data.status = 'pending';
            data.emailVerified = false;
            
            const registeredData = await authSvc.createUser(data);
            
            // Send OTP email
            try {
            await mailSvc.sendEmail(
                registeredData.email,
                    "Email Verification OTP - Bluebook Renewal System",
                `Dear ${registeredData.name}, <br />
                    <p>Thank you for registering on Bluebook Renewal System!</p><br/>
                    <p>Your verification OTP is: <strong style="font-size: 24px; color: #007bff;">${emailOtp}</strong></p><br/>
                    <p>This OTP is valid for 10 minutes.</p><br/>
                    <p>Please enter this OTP to verify your email address and activate your account.</p><br/>
                <p>If you did not register, please ignore this email.</p><br/>
                <p>Thank you!</p>
                    <p>Regards,</p>
                    <p>Bluebook Renewal System Team</p>
                    <p><small>Please do not reply to this email</small></p>
                    `
                );
                
                res.json({
                    result: {
                        userId: registeredData._id,
                        email: registeredData.email,
                        name: registeredData.name
                    },
                    message: "Registration successful! Please check your email for the verification OTP.",
                    meta: null
                });
            } catch (emailError) {
                console.error('Failed to send OTP email:', emailError);
                
                // Demo mode: Show OTP in console instead of failing
                if (process.env.DISABLE_EMAIL === 'true' || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD || process.env.SMTP_PASSWORD === 'your_app_password_here') {
                    console.log('\n📧 DEMO MODE: Email not configured');
                    console.log(`📱 OTP for ${registeredData.email}: ${emailOtp}`);
                    console.log('💡 To enable real email sending, configure SMTP settings in .env file\n');
                    
            res.json({
                        result: {
                            userId: registeredData._id,
                            email: registeredData.email,
                            name: registeredData.name
                        },
                        message: `Registration successful! Demo OTP: ${emailOtp} (Check server console for OTP)`,
                meta: null
                    });
                } else {
                    // Delete the user if email fails and SMTP is configured
                    await authSvc.deleteUser(registeredData._id);
                    throw {code: 500, message: "Failed to send verification email. Please try again."};
                }
            }
        }catch(exception){
            next(exception)
        }
    }

    // Verifies the OTP sent to user's email and activates the account if valid.
    verifyEmailOtp = async(req, res, next)=>{
        try{
            const {userId, otp} = req.body;
            
            if (!userId || !otp) {
                throw {code: 400, message: "User ID and OTP are required"};
            }
            
            // Validate OTP format (6 digits)
            if (!/^\d{6}$/.test(otp)) {
                throw {code: 400, message: "OTP must be a 6-digit number"};
            }
            
            const user = await authSvc.findOneUser({_id: userId});
            if (!user) {
                throw {code: 404, message: "User not found"};
            }
            
            if (user.status === 'active') {
                throw {code: 400, message: "Account is already verified"};
            }
            
            if (!user.emailOtp) {
                throw {code: 400, message: "No OTP found for this user"};
            }
            
            if (user.emailOtp !== otp) {
                throw {code: 400, message: "Invalid OTP"};
            }
            
            if (!user.emailOtpExpiresAt || user.emailOtpExpiresAt < new Date()) {
                throw {code: 400, message: "OTP has expired. Please register again"};
            }
            
            // Update user status
            const updatedResult = await authSvc.updateUser({
                status: 'active',
                emailVerified: true,
                emailOtp: null,
                emailOtpExpiresAt: null
            }, user._id);
            
            res.json({
                result: {
                    userId: updatedResult._id,
                    email: updatedResult.email,
                    name: updatedResult.name,
                    status: updatedResult.status
                },
                message: "Email verified successfully! You can now login to your account.",
                meta: null 
            });
        }catch(exception){
            next(exception);
        }
    }
    
    // Resends a new OTP to the user's email for verification.
    resendOtp = async(req, res, next)=>{
        try{
            const {userId} = req.body;
            
            if (!userId) {
                throw {code: 400, message: "User ID is required"};
            }
            
            const user = await authSvc.findOneUser({_id: userId});
            if (!user) {
                throw {code: 404, message: "User not found"};
            }
            
            if (user.status === 'active') {
                throw {code: 400, message: "Account is already verified"};
            }
            
            // Generate new OTP
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Update user with new OTP
            await authSvc.updateUser({
                emailOtp: newOtp,
                emailOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
            }, user._id);
            
            // Send new OTP email
            try {
                await mailSvc.sendEmail(
                    user.email,
                    "New Email Verification OTP - Bluebook Renewal System",
                    `Dear ${user.name}, <br />
                    <p>You requested a new verification OTP.</p><br/>
                    <p>Your new verification OTP is: <strong style="font-size: 24px; color: #007bff;">${newOtp}</strong></p><br/>
                    <p>This OTP is valid for 10 minutes.</p><br/>
                    <p>Please enter this OTP to verify your email address and activate your account.</p><br/>
                    <p>If you did not request this, please ignore this email.</p><br/>
                    <p>Thank you!</p>
                    <p>Regards,</p>
                    <p>Bluebook Renewal System Team</p>
                    <p><small>Please do not reply to this email</small></p>
                    `
                );
                
                res.json({
                    result: {
                        userId: user._id,
                        email: user.email
                    },
                    message: "New OTP sent successfully! Please check your email.",
                    meta: null
                });
            } catch (emailError) {
                console.error('Failed to send new OTP email:', emailError);
                
                // Demo mode: Show OTP in console instead of failing
                if (process.env.DISABLE_EMAIL === 'true' || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD || process.env.SMTP_PASSWORD === 'your_app_password_here') {
                    console.log('\n📧 DEMO MODE: Email not configured');
                    console.log(`📱 New OTP for ${user.email}: ${newOtp}`);
                    console.log('💡 To enable real email sending, configure SMTP settings in .env file\n');
                    
                    res.json({
                        result: {
                            userId: user._id,
                            email: user.email
                        },
                        message: `New OTP sent! Demo OTP: ${newOtp} (Check server console for OTP)`,
                        meta: null
                    });
                } else {
                    throw {code: 500, message: "Failed to send new OTP. Please try again."};
                }
            }
        }catch(exception){
            next(exception);
        }
    }
    
    // Activates a user account using an activation token.
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

    // Handles user login, checks credentials, status, and returns JWT tokens if successful.
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
                 
                if(userDetail.status === 'pending'){
                    throw {code: 400, message: "Please verify your email address before logging in. Check your email for the verification OTP."}
                }
                if(userDetail.status === 'inactive'){
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
                    success: true,
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
            }else{
                throw {code: 400, message: "Credentials doesnt match"}
            }
            
        }catch(exception){
            next(exception);
        }
    }

    // Returns the profile of the currently logged-in user.
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
                meta: null
            })
        }catch(exception){
            next(exception);
        }
    }
    
    // Updates the profile of the currently logged-in user after validation.
    updateProfile = async(req, res, next)=>{
        try{
            const {name, email, citizenshipNo} = req.body;
            const userId = req.authUser._id;
            
            // Check if email is already taken by another user
            if(email !== req.authUser.email) {
                const existingUser = await authSvc.findOneUser({email: email});
                if(existingUser && existingUser._id.toString() !== userId.toString()) {
                    throw {code: 400, message: "Email is already taken by another user"}
                }
            }
            
            // Check if citizenship number is already taken by another user
            if(citizenshipNo !== req.authUser.citizenshipNo) {
                const existingUser = await authSvc.findOneUser({citizenshipNo: citizenshipNo});
                if(existingUser && existingUser._id.toString() !== userId.toString()) {
                    throw {code: 400, message: "Citizenship number is already taken by another user"}
                }
            }
            
            const updateData = {
                name: name,
                email: email,
                citizenshipNo: citizenshipNo
            };
            
            const updatedUser = await authSvc.updateUser(updateData, userId);
            
            const response = {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                citizenshipNo: updatedUser.citizenshipNo,
                role: updatedUser.role,
                status: updatedUser.status,
                image: updatedUser?.image
            }
            
            res.json({
                result: response,
                message: "Profile updated successfully",
                meta: null
            })
        }catch(exception){
            next(exception);
        }
    }

    // Returns the authenticated user's data for admin access check.
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

    // Fetches all users and returns user data with meta statistics (admin only).
    getAllUsers = async (req, res, next) => {
        try {
            const users = await authSvc.findAllUsers();
            
            res.json({
                result: users,
                message: "All users fetched successfully",
                meta: {
                    total: users.length,
                    active: users.filter(user => user.status === 'active').length,
                    inactive: users.filter(user => user.status === 'inactive').length,
                    admins: users.filter(user => user.role === 'admin').length,
                    regularUsers: users.filter(user => user.role === 'user').length
                }
            });
        } catch (exception) {
            next(exception);
        }
    }

    // Fetches a single user by ID (admin only).
    getUserById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await authSvc.findOneUser({ _id: id });
            
            if (!user) {
                throw { code: 404, message: "User not found" };
            }
            
            res.json({
                result: user,
                message: "User fetched successfully",
                meta: null
            });
        } catch (exception) {
            next(exception);
        }
    }

    // Updates a user's status (active/inactive) by ID (admin only).
    updateUserStatus = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            if (!['active', 'inactive'].includes(status)) {
                throw { code: 400, message: "Invalid status. Must be 'active' or 'inactive'" };
            }
            
            const updatedUser = await authSvc.updateUser({ status }, id);
            
            if (!updatedUser) {
                throw { code: 404, message: "User not found" };
            }
            
            res.json({
                result: updatedUser,
                message: `User status updated to ${status} successfully`,
                meta: null
            });
        } catch (exception) {
            next(exception);
        }
    }

    // Updates a user's information by ID after validation (admin only).
    updateUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, email, citizenshipNo, role, status } = req.body;
            
            // Validate required fields
            if (!name || !email || !citizenshipNo) {
                throw { code: 400, message: "Name, email, and citizenship number are required" };
            }
            
            // Validate role
            if (!['admin', 'user'].includes(role)) {
                throw { code: 400, message: "Invalid role. Must be 'admin' or 'user'" };
            }
            
            // Validate status
            if (!['active', 'inactive'].includes(status)) {
                throw { code: 400, message: "Invalid status. Must be 'active' or 'inactive'" };
            }
            
            // Check if user exists
            const existingUser = await authSvc.findOneUser({ _id: id });
            if (!existingUser) {
                throw { code: 404, message: "User not found" };
            }
            
            // Check if email is already taken by another user
            if (email !== existingUser.email) {
                const emailExists = await authSvc.findOneUser({ email: email });
                if (emailExists && emailExists._id.toString() !== id) {
                    throw { code: 400, message: "Email is already taken by another user" };
                }
            }
            
            // Check if citizenship number is already taken by another user
            if (citizenshipNo !== existingUser.citizenshipNo) {
                const citizenshipExists = await authSvc.findOneUser({ citizenshipNo: citizenshipNo });
                if (citizenshipExists && citizenshipExists._id.toString() !== id) {
                    throw { code: 400, message: "Citizenship number is already taken by another user" };
                }
            }
            
            // Update user data
            const updateData = {
                name,
                email,
                citizenshipNo,
                role,
                status
            };
            
            const updatedUser = await authSvc.updateUser(updateData, id);
            
            res.json({
                result: updatedUser,
                message: "User updated successfully",
                meta: null
            });
        } catch (exception) {
            next(exception);
        }
    }

    // Deletes a user by ID after checking existence and role (admin only).
    deleteUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            
            // Check if user exists
            const user = await authSvc.findOneUser({ _id: id });
            if (!user) {
                throw { code: 404, message: "User not found" };
            }
            
            // Prevent deletion of admin users
            if (user.role === 'admin') {
                throw { code: 403, message: "Cannot delete admin users" };
            }
            
            // Delete the user
            const deletedUser = await authSvc.deleteUser(id);
            
            res.json({
                result: deletedUser,
                message: "User deleted successfully",
                meta: null
            });
        } catch (exception) {
            next(exception);
        }
    }

    // Creates a new admin user (admin only).
    createAdmin = async (req, res, next) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }
            // Check for existing user
            const existing = await require('../user/user.model').findOne({ email });
            if (existing) {
                return res.status(400).json({ message: "Email already in use" });
            }
            // Create admin user
            const newUser = new (require('../user/user.model'))({
                name,
                email,
                password, // Should be hashed by pre-save hook
                role: "admin",
                status: "active"
            });
            await newUser.save();
            res.status(201).json({ message: "Admin created successfully", result: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, status: newUser.status } });
        } catch (err) {
            next(err);
        }
    }
}
const authCtrl = new AuthController();
module.exports = authCtrl;