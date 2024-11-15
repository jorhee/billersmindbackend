//payer controllers
//Dependencies and modules
const bcrypt = require("bcrypt");

const Patient = require("../models/Patient");
const Payer = require("../models/Payer");
const Provider = require("../models/Provider");

const auth = require("../middleware/auth");
const { authMiddleware, verify, verifyAdmin, isLoggedIn, errorHandler} = auth;
const mongoose = require('mongoose');  // Import mongoose





// adding provider


module.exports.addProvider = async (req, res) => {
    const { name, address, phone, fax, npi, ptan, taxId } = req.body;
    //const userId = req.user._id; // User ID from the authenticated user
    //const   addedBy = req.user._id;

    try {
        // Optional: Check if NPI or PTAN already exists
        const existingProvider = await Provider.findOne({ npi });
        if (existingProvider) {
            return res.status(400).send({ message: 'A provider with this NPI already exists.' });
        }

        // Create a new provider instance
        const newProvider = new Provider({
            name,
            address,
            phone,
            fax,
            npi,
            ptan,
            taxId,
             addedBy: {
                userId: req.user._id, // Store user ID
                firstName: req.user.firstName, // Store first name
                lastName: req.user.lastName, // Store last name
                email: req.user.email, // Store email
            }
        });

        // Save the provider to the database
        const savedProvider = await newProvider.save();

        // Send success response
        res.status(201).send({
            message: "Provider added successfully",
            provider: savedProvider
        });
    } catch (error) {
        // Catch any errors and return a 500 status with the error message
        res.status(500).send({
            message: error.message
        });
    }
};


// To get Provider by ID:

module.exports.getProviderById = async (req,res) => {

    const providerId = req.params.providerId;

       try {
        const provider = await Provider.findById(providerId);
        
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        // If provider is found, send it as a response
        res.status(200).json(provider);
    } catch (error) {
        // Log and handle any errors, like invalid ObjectId format
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



// Controller to update a provider by ID
module.exports.updateProvider = async (req, res) => {
    const providerId = req.params.id; // Get the provider ID from the request URL
    const { name, address, phone, fax, npi, ptan, taxId } = req.body; // Get fields to update from request body

    try {
        // Find the provider by ID and update its fields
        const updatedProvider = await Provider.findByIdAndUpdate(
            providerId,
            { 
                name,
                address,
                phone,
                fax,
                npi,
                ptan,
                taxId 
            },
            { new: true, runValidators: true } // Return the updated provider, and run schema validation
        );

        // If the provider is not found, return a 404 error
        if (!updatedProvider) {
            return res.status(404).send({
                message: 'Provider not found'
            });
        }

        // Send the updated provider as the response
        res.status(200).send({
            message: "Provider updated successfully",
            provider: updatedProvider
        });
    } catch (error) {
        // Catch any errors and return a 500 status with the error message
        res.status(500).send({
            message: 'Error updating provider',
            error: error.message
        });
    }
};


// Controller to get all providers
module.exports.getAllProviders = async (req, res) => {
    try {
        // Retrieve all providers from the database
        const providers = await Provider.find();

        // Send the list of providers as the response
        res.status(200).send(providers);
    } catch (error) {
        // Catch any errors and return a 500 status with the error message
        res.status(500).send({
            message: 'Error retrieving providers',
            error: error.message
        });
    }
};

// Controller to delete a provider by ID

module.exports.deleteProvider = async (req, res) => {
    const { id } = req.params; // Get the provider ID from the request parameters

    try {
        // Find and delete the provider by ID
        const deletedProvider = await Provider.findByIdAndDelete(id);

        if (!deletedProvider) {
            return res.status(404).send({
                message: 'Provider not found.'
            });
        }

        // Send success response
        res.status(200).send({
            message: 'Provider deleted successfully.',
            provider: deletedProvider // Return the deleted provider data (optional)
        });
    } catch (error) {
        // Catch any errors and return a 500 status with the error message
        res.status(500).send({
            message: 'Error deleting provider',
            error: error.message
        });
    }
};