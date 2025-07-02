const auth = require('../../middleware/auth.middleware');
const allowRole = require('../../middleware/rbac.middleware');
const { setPath, uploader } = require('../../middleware/uploader.middleware');
const { bodyValidator } = require('../../middleware/validator.middleware');
const bluebookCtrl = require('./bluebook.controller');
const { bluebookCreateDTO, bluebookFetchDTO } = require('./bluebook.dto');

const blueBookRoute = require('express').Router();

blueBookRoute.post('/', bodyValidator(bluebookCreateDTO),auth,allowRole('admin'), bluebookCtrl.createBluebook);
blueBookRoute.get('/my-bluebooks', auth, bluebookCtrl.getMyBluebook)
blueBookRoute.get('/:id',auth, allowRole('admin'), bluebookCtrl.verifyBluebook)
blueBookRoute.post('/fetchBluebook', auth, bodyValidator(bluebookFetchDTO), bluebookCtrl.fetchBluebook )
blueBookRoute.get('/fetch/:id', auth, bluebookCtrl.fetchBluebookById )

module.exports = blueBookRoute