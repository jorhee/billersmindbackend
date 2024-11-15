//user routes
//[dependencies and modules]
const express = require("express");


const patientController = require("../controllers/patient");

const auth = require("../middleware/auth");
const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;

//[routing component]
const router = express.Router();



// Add Patient -
router.post('/:providerId/add-patient', verify, isLoggedIn, patientController.addPatient);

//Get all Patients per ProviderID
router.get('/:providerId/all', verify, isLoggedIn, patientController.getAllPatientsByProviderId);


// Route to retrieve all patients
router.get('/all', verify, isLoggedIn, patientController.getAllPatients);

// Route to retrieve a patient by ID
router.get('/:patientId', verify, isLoggedIn, patientController.getPatientById);

// Route to update a patient by ID
router.put('/:patientId', verify, isLoggedIn, patientController.updatePatient);

// Route to delete a patient by ID
router.delete('/:patientId', verify, isLoggedIn, patientController.deletePatient);








//[export route system]
module.exports = router;