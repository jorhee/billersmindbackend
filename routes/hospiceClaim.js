//[dependencies and modules]
const express = require("express");


const hospiceClaimController = require("../controllers/hospiceClaim");

const auth = require("../middleware/auth");
const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;

//[routing component]
const router = express.Router();

// Route to pending claims
router.post('/:providerId/pending-claim', verify, isLoggedIn, hospiceClaimController.pendingClaim);

// Route to generate a claim
router.post('/:providerId/add-claim', verify, isLoggedIn, hospiceClaimController.addClaim);

//Get all claims per ProviderID
router.get('/:providerId/all-claims', verify, isLoggedIn, hospiceClaimController.getAllClaimsByProviderId);


// Route to retrieve a claim by ID
//router.get('/:claimId', verify, isLoggedIn, claimController.getClaimById);

// Route to update a claim by ID
//router.put('/update/:claimId', verify, isLoggedIn, claimController.updateClaim);

// Route to delete a claims of Election by ID
//router.delete('/delete/:claimId', verify, isLoggedIn, claimController.deleteClaim);



//[export route system]
module.exports = router;