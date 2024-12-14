const WageIndex = require("../models/WageIndex");
const User = require('../models/User');

const mongoose = require('mongoose');  // Import mongoose


module.exports.getWageIndex = async (req, res) => {

	  try {
    // Retrieve all wage index records
    const wageIndexes = await WageIndex.find();

    // Handle case when no data is found
    if (wageIndexes.length === 0) {
      return res.status(404).json({
        message: "No wage index data found.",
      });
    }

    // Return all wage index records
    res.status(200).json(wageIndexes);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message || "An unexpected error occurred",
    });
  }
};