//provider routes
//[dependencies and modules]
const express = require("express");

const providerController = require("../controllers/provider");

const auth = require("../middleware/auth");
const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;
const path = require('path');


//[routing component]
const router = express.Router();


// Route for adding a provider
router.post('/add-provider', verify, isLoggedIn, verifyAdmin, providerController.addProvider);

// Route for updating a provider by ID
router.patch('/update/:id', verify, isLoggedIn, verifyAdmin, providerController.updateProvider);

// Route for retrieving all providers
router.get('/all', verify, isLoggedIn, providerController.getAllProviders);

// Route for retrieving one providers
router.get('/:providerId', verify, isLoggedIn, providerController.getProviderById);

// Route to delete a provider by ID
router.delete('/delete/:id', verify, isLoggedIn, verifyAdmin, providerController.deleteProvider);












//[export route system]
module.exports = router;