const express = require("express");

const hospiceRateController = require("../controllers/hospiceRate");

const auth = require("../middleware/auth");
const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;

//[routing component]
const router = express.Router();

router.post('/add', verify, verifyAdmin, isLoggedIn, hospiceRateController.addHospiceRate)













module.exports = router;