//payer controllers
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

//add Payer


module.exports.addPayer = async (req,res) => {

	const { name, address, payerId, phone, fax } = req.body;

    try {
        // Check if payerId already exists (Optional step for uniqueness validation)
        const existingPayer = await Payer.findOne({ payerId });
        if (existingPayer) {
            return res.status(400).send({ message: 'Payer with this payerId already exists.' });
        }

        // Create a new payer instance
        const newPayer = new Payer({
            name,
            address,
            payerId,
            phone,
            fax
        });

        // Save the payer to the database
        const savedPayer = await newPayer.save();

        // Send success response
        res.status(201).send({
            message: "Payer added successfully",
            payer: savedPayer
        });
    } catch (error) {
        // Catch any errors and return a 500 status with the error message
        res.status(500).send({
            message: 'Error adding payer',
            error: error.message
        });
    }

}

//to RETRIEVE ALL PAYERS

module.exports.getAllPayers = async (req, res) => {
    try {
        // Retrieve all payers from the database
        const payers = await Payer.find();


        // Send success response with the list of payers
        res.status(200).send(payers);
    } catch (error) {
        // Catch any errors and return a 500 status with the error message
        res.status(500).send({
            message: 'Error retrieving payers',
            error: error.message
        });
    }
};


//Get payer by ID:

module.exports.getPayerById = async (req, res) => {

try {
        const payer = await Payer.findById(req.params.payerId);
        if (!payer) {
            return res.status(404).json({ message: 'Payer not found' });
        }
        res.json(payer);
    } catch (error) {
        console.error('Error fetching payer:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to update a payer by ID

module.exports.updatePayer = async (req, res) => {
    const { payerId } = req.params; // Get the payer ID from the request parameters
    const updates = req.body;  // Get the updated data from the request body

    try {
        // Find and update the payer by ID
        const updatedPayer = await Payer.findByIdAndUpdate(payerId, updates, {
            new: true, // Return the updated document
            runValidators: true // Run validation on the updated data
        });

        if (!updatedPayer) {
            return res.status(404).send({
                message: 'Payer not found.'
            });
        }

        // Send success response with the updated payer data
        res.status(200).send({
            message: 'Payer updated successfully.',
            payer: updatedPayer
        });
    } catch (error) {
        // Catch any errors and return a 500 status with the error message
        res.status(500).send({
            message: 'Error updating payer',
            error: error.message
        });
    }
};

// Controller to delete a payer by ID
module.exports.deletePayer = async (req, res) => {
    const { payerId } = req.params; // Get the payer ID from request parameters

    try {
        const deletedPayer = await Payer.findByIdAndDelete(payerId); // Find and delete the payer

        if (!deletedPayer) {
            return res.status(404).send({
                message: 'Payer not found.'
            });
        }

        // Send success response
        res.status(200).send({
            message: 'Payer deleted successfully.',
            payer: deletedPayer // Optionally return the deleted payer data
        });
    } catch (error) {
        // Catch any errors and return a 500 status with the error message
        res.status(500).send({
            message: 'Error deleting payer',
            error: error.message
        });
    }
};

