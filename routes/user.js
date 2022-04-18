const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

console.log('in user routes')
const userController = require('../controller/userController')
//const {userAuthentication} = require('../controller/authController'); 

// @route      POST api/users/login
// @desc       User Login
// @access     Public

//router.post('/login',userAuthentication);
router.post('/register', userController.addNewUser);

module.exports = router;