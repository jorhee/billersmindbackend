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