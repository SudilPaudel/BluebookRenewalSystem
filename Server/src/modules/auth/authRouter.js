const authRoute = require('express').Router();
const {bodyValidator}= require('../../middleware/validator.middleware')
const {registerDTO, loginDTO}= require('./auth.dto');
const {setPath, uploader} = require('../../middleware/uploader.middleware');
const auth = require('../../middleware/auth.middleware');
const allowRole= require('../../middleware/rbac.middleware');
const authCtrl = require('./auth.controller');


authRoute.post('/register', setPath('users'), uploader.single('image'), bodyValidator(registerDTO), authCtrl.register);
authRoute.get('/activate/:token', authCtrl.activate);
authRoute.post('/login', bodyValidator(loginDTO), authCtrl.login);
authRoute.get('/profile', auth, authCtrl.getLoggedIn)

//admin route 
authRoute.get('/admin', auth, allowRole('admin'), authCtrl.getadminAccess)


module.exports = authRoute;