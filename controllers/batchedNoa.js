//Dependencies and modules
const bcrypt = require("bcrypt");

const Patient = require("../models/Patient");
const Payer = require("../models/Payer");
const Provider = require("../models/Provider");
const BatchedNoa = require("../models/BatchedNoa");


const auth = require("../middleware/auth");
const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;

const mongoose = require('mongoose');  // Import mongoose

// export date validation from utils/dateValidation.js
const validation = require("../utils/validation");

const { validateDate } = validation;


//v2 with patient update noaId included.
module.exports.createBatchedNoa = async (req, res) => {
    const {
        patientId,
        placeOfService,
        payerId,
        memberId,
        admitDate,
        typeOfBill,
        benefitPeriod,
        primaryDiagnosis,
        AttMd
    } = req.body;

    try {
        const { providerId } = req.params; // Get providerId from request params

        // Step 1: Validate provider
        const provider = await Provider.findById(providerId);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found.' });
        }

        // Step 2: Validate payerId
        const payer = await Payer.findById(payerId);
        if (!payer) {
            return res.status(404).json({ message: 'Payer not found.' });
        }

        // Step 3: Validate admitDate
        const admitDateValidation = validateDate(admitDate);
        if (!admitDateValidation.isValid) {
            return res.status(400).json({ message: admitDateValidation.message });
        }

        // Step 4: Check for duplicate BatchedNoa entries
        const existingNoa = await BatchedNoa.findOne({
            patientId,
            admitDate: admitDateValidation.parsedDate,
            payerId
        });
        if (existingNoa) {
            return res.status(400).json({ message: 'Duplicate entry found for the same Patient ID, Admit Date, and Payer ID.' });
        }

        // Step 5: Validate benefitPeriod dates and calculate BeneTermDate
        const parsedBenefitPeriod = await Promise.all(benefitPeriod.map(async (b) => {
            const startDateValidation = validateDate(b.BeneStartDate);
            if (!startDateValidation.isValid) {
                throw new Error(startDateValidation.message);
            }
            const startDateParts = startDateValidation.parsedDate.split('/').map(num => parseInt(num, 10));
            const BeneStartDate = new Date(Date.UTC(startDateParts[2], startDateParts[0] - 1, startDateParts[1]));

            let BeneTermDate;
            if (b.benefitNum === 1 || b.benefitNum === 2) {
                BeneTermDate = new Date(BeneStartDate);
                BeneTermDate.setUTCDate(BeneStartDate.getUTCDate() + 89);
            } else if (b.benefitNum > 2) {
                BeneTermDate = new Date(BeneStartDate);
                BeneTermDate.setUTCDate(BeneStartDate.getUTCDate() + 59);
            } else {
                throw new Error("Invalid benefitNum value");
            }

            const formattedBeneTermDate = `${String(BeneTermDate.getUTCMonth() + 1).padStart(2, '0')}/${String(BeneTermDate.getUTCDate()).padStart(2, '0')}/${BeneTermDate.getUTCFullYear()}`;
            return {
                benefitNum: b.benefitNum,
                BeneStartDate: startDateValidation.parsedDate,
                BeneTermDate: formattedBeneTermDate
            };
        }));

        // Step 6: Set sentDate if not provided, and calculate isNoaLate
        const sentDate = req.body.sentDate || (() => {
            const today = new Date();
            return `${String(today.getUTCMonth() + 1).padStart(2, '0')}/${String(today.getUTCDate()).padStart(2, '0')}/${today.getUTCFullYear()}`;
        })();

        const admitDateParts = admitDateValidation.parsedDate.split('/').map(num => parseInt(num, 10));
        const parsedAdmitDate = new Date(Date.UTC(admitDateParts[2], admitDateParts[0] - 1, admitDateParts[1]));
        const sentDateParts = sentDate.split('/').map(num => parseInt(num, 10));
        const parsedSentDate = new Date(Date.UTC(sentDateParts[2], sentDateParts[0] - 1, sentDateParts[1]));

        const dayDifference = (parsedSentDate - parsedAdmitDate) / (1000 * 60 * 60 * 24);
        const isNoaLate = dayDifference > 5;
        const comments = isNoaLate ? [{
            remarks: `Late NOA sent on ${sentDate}`,
            status: 'In-progress',
            date: new Date()
        }] : [];

        // Step 7: Create the BatchedNoa
        const newBatchedNoa = new BatchedNoa({
            providerId,
            patientId,
            placeOfService,
            payerId,
            memberId,
            admitDate: admitDateValidation.parsedDate,
            typeOfBill,
            benefitPeriod: parsedBenefitPeriod,
            primaryDiagnosis,
            AttMd,
            sentDate,
            isNoaLate,
            comments
        });
        const savedBatchedNoa = await newBatchedNoa.save();

        // Step 8: Update Patient with BatchedNoa ID
        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            { $push: { noaId: savedBatchedNoa._id } },
            { new: true, useFindAndModify: false }
        );
        if (!updatedPatient) {
            return res.status(404).json({ message: 'Patient not found to update noaId.' });
        }

        // Step 9: Send success response
        res.status(201).json({
            message: 'BatchedNoa created and Patient updated successfully.',
            batchedNoa: savedBatchedNoa,
            updatedPatient
        });

    } catch (error) {
        console.error('Error in createBatchedNoa:', error);
        res.status(500).json({
            message: 'Error adding BatchedNoa',
            error: error.message
        });
    }
};


// Controller to retrieve all patients by ProviderID

module.exports.getAllNoaByProviderId = async (req, res) => {

    const { providerId } = req.params; // Get provider ID from request parameters

    try {
        const notices = await BatchedNoa.find({ providerId: providerId }); 
        // Find notices by provider ID

        if (notices.length === 0) {
            return res.status(404).send({
                message: 'No NOA found for this provider.'
            });
        }

        res.status(200).send(notices); // Send the list of noe as response
    } catch (error) {
        res.status(500).send({
            message: 'Error retrieving NOE',
            error: error.message
        });
    }

};


// Controller to retrieve all Notices of Election
module.exports.getAllNoticesOfElection = async (req, res) => {
    try {
        const notices = await BatchedNoa.find(); // Retrieve all Notices of Election
        res.status(200).send(notices); // Send the notices as a response
    } catch (error) {
        res.status(500).send({
            message: 'Error retrieving Notices of Election',
            error: error.message
        });
    }
};

// Controller to retrieve a single Notice of Election by ID
module.exports.getNoaById = async (req, res) => {
    const { noaId } = req.params; // Get Notice ID from request parameters

    try {
        const notice = await BatchedNoa.findById(noaId); // Find the Notice of Election by ID

        if (!notice) {
            return res.status(404).send({
                message: 'Notice of Election not found.'
            });
        }

        res.status(200).send(notice); // Send the notice as a response
    } catch (error) {
        res.status(500).send({
            message: 'Error retrieving Notice of Election',
            error: error.message
        });
    }
};

// Controller to update a Notice of Election by ID
module.exports.updateNoticeOfElection = async (req, res) => {
    const { noaId } = req.params; // Get Notice ID from request parameters
    const updates = req.body; // Get the updates from the request body

    try {
        const updatedNotice = await BatchedNoa.findByIdAndUpdate(noaId, updates, {
            new: true, // Return the updated document
            runValidators: true // Validate the update against the schema
        });

        if (!updatedNotice) {
            return res.status(404).send({
                message: 'Notice of Election not found.'
            });
        }

        res.status(200).send({
            message: 'Notice of Election updated successfully.',
            notice: updatedNotice
        });
    } catch (error) {
        res.status(500).send({
            message: 'Error updating Notice of Election',
            error: error.message
        });
    }
};

// Controller to delete a Notice of Election by ID
module.exports.deleteNoticeOfElection = async (req, res) => {
    const { noaId } = req.params; // Get Notice ID from request parameters

    try {
        const deletedNotice = await BatchedNoa.findByIdAndDelete(noaId); // Find and delete the Notice of Election

        if (!deletedNotice) {
            return res.status(404).send({
                message: 'Notice of Election not found.'
            });
        }

        res.status(200).send({
            message: 'Notice of Election deleted successfully.',
            notice: deletedNotice // Optionally return the deleted notice data
        });
    } catch (error) {
        res.status(500).send({
            message: 'Error deleting Notice of Election',
            error: error.message
        });
    }
};