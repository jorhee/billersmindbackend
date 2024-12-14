const express = require("express");

const wageIndexController = require("../controllers/wageIndex");

const auth = require("../middleware/auth");
const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;

//[routing component]
const router = express.Router();


router.get('/getWageIndex', verify, verifyAdmin, isLoggedIn, wageIndexController.getWageIndex)













module.exports = router;