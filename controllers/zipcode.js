const Zipcode = require("../models/Zipcode");


const mongoose = require('mongoose');  // Import mongoose

module.exports.getZipcode = async (req, res) => {

	try {
    const { zip }  = req.body; // Extract the ZIP code from the body
    
       // Ensure zip is present and is a string
    if (!zip || typeof zip !== 'string') {
      return res.status(400).json({ message: 'Invalid or missing zip parameter' });
    }

    const zipcode = await Zipcode.findOne({ zip }); // Query by the ZIP field

    if (!zipcode) {
      return res.status(404).json({ message: 'Zipcode not found' });
    }

    res.status(200).json(zipcode);
  } catch (error) {
    console.error('Error fetching zipcode:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports.getAllZipcodes = async (req, res) => {

	try {
    const zipcodes = await Zipcode.find(); // Fetch all documents in the collection
    res.status(200).json(zipcodes);
  } catch (error) {
    console.error('Error fetching zipcodes:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports.addZip = async (req, res) => {

try {
    const {
      zip,
      type,
      primary_city,
      acceptable_cities,
      state,
      county,
      newCountyName,
      cbsa
    } = req.body;

    // Validate required fields
    if (!zip || !type || !primary_city || !state || !county) {
      return res.status(400).json({
        message: "zip, type, primary_city, state, and county are required."
      });
    }

    // Ensure ZIP code is a valid 5-digit number
    if (!/^\d{5}$/.test(zip)) {
      return res.status(400).json({
        message: "ZIP code must be a 5-digit number."
      });
    }

    // Check if the ZIP code already exists
    const existingZipcode = await Zipcode.findOne({ zip });
    if (existingZipcode) {
      return res.status(409).json({
        message: `ZIP code ${zip} already exists in the database.`
      });
    }

    // Create a new ZIP code document
    const newZipcode = new Zipcode({
      zip,
      type,
      primary_city,
      acceptable_cities: acceptable_cities || [], // Default to empty array if not provided
      state,
      county,
      newCountyName,
      cbsa
    });

    // Save the ZIP code to the database
    const savedZipcode = await newZipcode.save();

    res.status(201).json({
      message: "ZIP code added successfully.",
      zipcode: savedZipcode
    });
  } catch (error) {
    console.error("Error adding ZIP code:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};