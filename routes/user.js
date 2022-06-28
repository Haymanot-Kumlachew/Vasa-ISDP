const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')


const userController = require('../controller/userController')

//don't need register and list_all_users for the mobile app
router.post('/register', userController.addNewUser);
router.post('/login', userController.login)
router.get('/logout', auth, userController.logout)
router.get('/refresh_token', userController.refreshToken);
router.get('/infor', auth,  userController.getUser)
router.delete('/delete', userController.deleteUser)
router.put('/update/password', auth, userController.updatePassword);
router.put('/update/info', auth, userController.updateUserInfo)
// console.log('in user routes')
router.post('/list_all_users', auth, userController.listAllUsers)


module.exports = router;