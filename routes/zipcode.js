const express = require("express");

const zipcodeController = require("../controllers/zipcode");

const auth = require("../middleware/auth");
const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;

//[routing component]
const router = express.Router();


router.get('/get', zipcodeController.getZipcode);

router.get('/all', zipcodeController.getAllZipcodes);














module.exports = router;