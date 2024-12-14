const express = require("express");

const hospiceCalculatorController = require("../controllers/hospiceCalculator");

const auth = require("../middleware/auth");
const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;

//[routing component]
const router = express.Router();

router.post('/add', verify, verifyAdmin, isLoggedIn, hospiceCalculatorController.addcalculator);

router.post('/search', hospiceCalculatorController.searchRate);













module.exports = router;