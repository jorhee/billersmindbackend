//patient controllers
//Dependencies and modules
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Patient = require("../models/Patient");
const Payer = require("../models/Payer");
const Provider = require("../models/Provider");

const auth = require("../middleware/auth");
const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;
const mongoose = require('mongoose');  // Import mongoose

// export date validation from utils/dateValidation.js
const validation = require("../utils/validation");

const { validateDate } = validation;



//addpatient v1 date as string:

module.exports.addPatient = async (req, res) => {
    const {
        lastName,
        firstName,
        dateOfBirth,
        gender,
        address,
        memberId
    } = req.body;

    const { providerId } = req.params; // Get providerId from req.params

    try {
        // Normalize memberId: Remove spaces and convert to lowercase
     
        // Call the validateDate function to validate the date of birth
        const dateValidation = validateDate(dateOfBirth);
        if (!dateValidation.isValid) {
            return res.status(400).send({
                message: dateValidation.message
            });
        }

        // Get the validated date (as a Date object)
        const dob = dateValidation.parsedDate;

        // Check for duplicate patient based on normalized memberId and dateOfBirth
        const existingPatient = await Patient.findOne({
            memberId,
            dateOfBirth: dob
        });

        if (existingPatient) {
            return res.status(400).send({
                message: 'A patient with the same date of birth and memberId already exists.'
            });
        }

        // Validate if providerId exists in the Provider collection
        const provider = await Provider.findById(providerId);
        if (!provider) {
            return res.status(400).send({
                message: 'Invalid providerId. Provider not found in the database.'
            });
        }

        // Create a new patient instance
        const newPatient = new Patient({
            lastName,
            firstName,
            dateOfBirth: dob, // Store as Date object
            gender,
            address,
            memberId, // Store the normalized memberId
            providerId // Store the validated providerId from params
        });

        // Save the patient to the database
        const savedPatient = await newPatient.save();

        // Send success response
        res.status(201).send({
            message: "Patient added successfully",
            patient: savedPatient
        });
    } catch (error) {
        // Catch any errors and return a 500 status with the error message
        res.status(500).send({
            message: 'Error adding patient',
            error: error.message
        });
    }
};




// Controller to retrieve all patients
module.exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find(); // Retrieve all patients
        res.status(200).send(patients); // Send patients as response
    } catch (error) {
        res.status(500).send({
            message: 'Error retrieving patients',
            error: error.message
        });
    }
};

// Controller to retrieve a single patient by ID
module.exports.getPatientById = async (req, res) => {
    const { patientId } = req.params; // Get patient ID from request parameters

    try {
        const patient = await Patient.findById(patientId); // Find patient by ID

        if (!patient) {
            return res.status(404).send({
                message: 'Patient not found.'
            });
        }

        res.status(200).send(patient); // Send the patient as response
    } catch (error) {
        res.status(500).send({
            message: 'Error retrieving patient',
            error: error.message
        });
    }
};

// Controller to retrieve all patients by ProviderID

module.exports.getAllPatientsByProviderId = async (req, res) => {

    const { providerId } = req.params; // Get provider ID from request parameters

    try {
        const patients = await Patient.find({ providerId: providerId }); // Find patients by provider ID

        if (patients.length === 0) {
            return res.status(404).send({
                message: 'No patients found for this provider.'
            });
        }

        res.status(200).send(patients); // Send the list of patients as response
    } catch (error) {
        res.status(500).send({
            message: 'Error retrieving patients',
            error: error.message
        });
    }

};



// Controller to update a patient by ID
module.exports.updatePatient = async (req, res) => {
    const { patientId } = req.params; // Get patient ID from request parameters
    const updates = req.body; // Get the updates from the request body

    try {
        const updatedPatient = await Patient.findByIdAndUpdate(patientId, updates, {
            new: true, // Return the updated document
            runValidators: true // Validate the update against the schema
        });

        if (!updatedPatient) {
            return res.status(404).send({
                message: 'Patient not found.'
            });
        }

        res.status(200).send({
            message: 'Patient updated successfully.',
            patient: updatedPatient
        });
    } catch (error) {
        res.status(500).send({
            message: 'Error updating patient',
            error: error.message
        });
    }
};

// Controller to delete a patient by ID
module.exports.deletePatient = async (req, res) => {
    const { patientId } = req.params; // Get patient ID from request parameters

    try {
        const deletedPatient = await Patient.findByIdAndDelete(patientId); // Find and delete the patient

        if (!deletedPatient) {
            return res.status(404).send({
                message: 'Patient not found.'
            });
        }

        res.status(200).send({
            message: 'Patient deleted successfully.',
            patient: deletedPatient // Optionally return the deleted patient data
        });
    } catch (error) {
        res.status(500).send({
            message: 'Error deleting patient',
            error: error.message
        });
    }
};

