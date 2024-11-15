//payer routes
//[dependencies and modules]
const express = require("express");

const payerController = require("../controllers/payer");

const auth = require("../middleware/auth");
const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;


//[routing component]
const router = express.Router();



// routes/payerRoutes.js

// Route for adding a payer
router.post('/add-payer', verify, isLoggedIn, verifyAdmin, payerController.addPayer);

// Route to retrieve all payers
router.get('/all', verify, isLoggedIn, payerController.getAllPayers);

// Route to update a payer by ID
router.put('/:payerId', verify, isLoggedIn, payerController.updatePayer);

//Route to retrieve a payer by ID
router.get('/:payerId', verify, isLoggedIn, payerController.getPayerById);

// Route to delete a payer
router.delete('/:payerId', verify, isLoggedIn, verifyAdmin, payerController.deletePayer);

//[export route system]
module.exports = router;