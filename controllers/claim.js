//Dependencies and modules
const Patient = require("../models/Patient");
const Payer = require("../models/Payer");
const Provider = require("../models/Provider");
const BatchedNoa = require("../models/BatchedNoa");
const Claim = require("../models/Claim");


const auth = require("../middleware/auth");
const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;

const mongoose = require('mongoose');  // Import mongoose

// export date validation from utils/dateValidation.js
const validation = require("../utils/validation");

const { validateDate } = validation;


module.exports.getAllClaimsByProviderId = async (req, res) => {

    const { providerId } = req.params; // Get provider ID from request parameters

    try {
        const claims = await Claim.find({ providerId: providerId }); 
        // Find notices by provider ID

        if (claims.length === 0) {
            return res.status(404).send({
                message: 'No Claims found for this provider.'
            });
        }

        res.status(200).send(claims); // Send the list of noe as response
    } catch (error) {
        res.status(500).send({
            message: 'Error retrieving Claims',
            error: error.message
        });
    }

};


module.exports.addClaim = async (req,res) => {

	// Helper function to get the last day of the month for a given date
	const getLastDayOfMonth = (date) => {
	    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	    return lastDay.toISOString().split('T')[0]; // Return the date in YYYY-MM-DD format
	};

	// Helper function to calculate the difference in days between two dates
	const calculateDaysBetween = (fromDate, toDate) => {
	    const from = new Date(fromDate);
	    const to = new Date(toDate);
	    const differenceInTime = to - from;
	    const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convert milliseconds to days
	    return Math.ceil(differenceInDays); // Return the difference rounded up to the nearest whole day
	};

	// Helper function to determine the fiscal year based on truDate
	const getFiscalYearFromDate = (truDate) => {
	    const truDateObj = new Date(truDate); // Convert truDate string to Date object
	    const currentYear = truDateObj.getFullYear();
	    const fiscalYearStart = new Date(currentYear, 9, 1); // October 1st of the current year

	    // If truDate is before October 1st, the fiscal year is the current year
	    if (truDateObj < fiscalYearStart) {
	        return `${currentYear}-${currentYear + 1}`;
	    } else {
	        return `${currentYear + 1}-${currentYear + 2}`; // Next fiscal year
	    }
	};

	try {
        const { noaId } = req.body; // Get noaId from request body
        const { providerId } = req.params; // Get providerId from request params

        // Step 1: Validate providerId from params
        const provider = await Provider.findById(providerId);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found.' });
        }

        // Step 2: Validate noaId
        const noa = await BatchedNoa.findById(noaId);
        if (!noa) {
            return res.status(404).json({ message: 'NoaId not found.' });
        }

        // Step 3: Extract relevant fields from the noa record
        const { payerId, patientId, typeOfService, admitDate } = noa;

        // Step 4: Validate payer and patient
        const payer = await Payer.findById(payerId);
        if (!payer) {
            return res.status(404).json({ message: 'Payer not found.' });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        // Step 5: Set fromDate based on the admitDate from the noa record
        const fromDate = admitDate; // Admit date is a string
        if (!fromDate) {
            return res.status(400).json({ message: 'Admit date not found in the noaId.' });
        }

        // Convert fromDate (string) to a Date object
        const fromDateObj = new Date(fromDate);

        // Step 6: Calculate the truDate (last day of the month based on fromDate)
        const truDate = getLastDayOfMonth(fromDateObj); // Convert fromDate to the last day of the month

        // Step 7: Calculate the number of days between fromDate and truDate
        const days = calculateDaysBetween(fromDateObj, truDate); // Use helper function to calculate the number of days

        // Step 8: Get fiscalYear based on truDate
        const fiscalYear = getFiscalYearFromDate(truDate); // Get fiscal year based on truDate

        // Step 9: Create the claim
        const newClaim = new Claim({
            providerId,
            patientId,
            payerId,
            memberId: 'Sample Member ID', // You can adjust this based on your logic
            typeOfService,
            noaId,
            fiscalYear, // Set fiscalYear dynamically based on truDate
            fromDate, // Use the admitDate as the fromDate (string format)
            truDate, // Set truDate as the last day of the month (string format)
            days, // Set the days calculated from fromDate and truDate
            typeOfBill: '81A', // You can adjust this based on your business logic
            expectedAmount: 500, // You can adjust this as per your logic
            claimStatus: 'Pending'
        });

        // Step 10: Save the claim to the database
        await newClaim.save();

        // Return a success message with the newly created claim
        return res.status(201).json({
            message: 'Claim created successfully from noaId.',
            claim: newClaim
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error occurred while creating the claim.', error: error.message });
    }
};
