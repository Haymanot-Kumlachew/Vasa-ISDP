const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth')

const reportController = require('../controller/reportController')

router.post('/create/:id', reportController.addReport);
router.post('/delete', reportController.deletedReport);
router.put('/approval', reportController.adminUpdates);
router.get('/getReports', reportController.getReports);
router.get('/getReports/:id', reportController.getReports);

// router.put('/update/info', auth, userController.updateUserInfo)

module.exports = router;