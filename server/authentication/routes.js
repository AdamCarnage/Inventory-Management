const express = require('express');
const router = express.Router();

const  AuthController  = require('./controllers/AuthController');

router.post('/register/', AuthController.create_user);
router.post('/login', AuthController.login_user);

module.exports = router;