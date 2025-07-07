const express = require('express');
const authRoute = express.Router();

const { bodyValidator } = require('../../middleware/validator.middleware');
const { registerDTO, loginDTO } = require('./auth.dto');
const { setPath, uploader } = require('../../middleware/uploader.middleware');
const authCtrl = require('./auth.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const allowRole = require('../../middleware/rbac.middleware');

authRoute.post('/register', setPath('users'), uploader.single('image'), bodyValidator(registerDTO), authCtrl.register);
authRoute.get('/activate/:token', authCtrl.activate);
authRoute.post('/login', bodyValidator(loginDTO), authCtrl.login);
authRoute.get('/profile', authMiddleware, authCtrl.getLoggedIn);
authRoute.put('/profile', authMiddleware, authCtrl.updateProfile);

// Admin-only route
authRoute.get('/admin', authMiddleware, allowRole('admin'), authCtrl.getadminAccess);

module.exports = authRoute;
