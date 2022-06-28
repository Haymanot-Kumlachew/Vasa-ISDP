const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const reportController = require('../controller/reportController')

//don't send toolList and workersList to create report route
router.post('/create', auth, reportController.addReport);
//Don't use /delete , /approval , getReports
router.post('/delete', reportController.deleteReport);
router.put('/approval', reportController.adminUpdates);
router.get('/getReports', reportController.getReports);
router.get('/getReport', reportController.gerReport);

// router.put('/update/info', auth, userController.updateUserInfo)

module.exports = router;