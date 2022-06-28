const express = require("express");
const router = express.Router();

router.post('/create', auth, reportController.addReport);
router.get('/getReport/:userID', reportController.gerReport);