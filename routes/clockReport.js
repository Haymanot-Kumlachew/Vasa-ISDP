const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const reportController = require('../controller/reportController')


router.post('/create', reportController.addReport);
router.post('/delete', reportController.deletedReport);
router.post('/approval', reportController.adminUpdates);

// router.put('/update/info', auth, userController.updateUserInfo)



module.exports = router;