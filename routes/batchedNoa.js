//[dependencies and modules]
const express = require("express");


const batchedNoaController = require("../controllers/batchedNoa");

const auth = require("../middleware/auth");
const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;

//[routing component]
const router = express.Router();


// Route to add a Notice of Election
router.post('/:providerId/batch', verify, isLoggedIn, batchedNoaController.createBatchedNoa);

//Get all Patients per ProviderID
router.get('/:providerId/all', verify, isLoggedIn, batchedNoaController.getAllNoaByProviderId);

// Route to retrieve all Notices of Election
router.get('/all', verify, isLoggedIn, batchedNoaController.getAllNoticesOfElection);

// Route to retrieve a Notice of Election by ID
router.get('/:noaId', verify, isLoggedIn, batchedNoaController.getNoaById);

// Route to update a Notice of Election by ID
router.put('/update/:noaId', verify, isLoggedIn, batchedNoaController.updateNoticeOfElection);

// Route to delete a Notice of Election by ID
router.delete('/delete/:noaId', verify, isLoggedIn, batchedNoaController.deleteNoticeOfElection);



//[export route system]
module.exports = router;