const HospiceCalculator = require("../models/HospiceCalculator");
const HospiceRate = require("../models/HospiceRate");
const WageIndex = require("../models/WageIndex");


const User = require('../models/User');

const mongoose = require('mongoose');  // Import mongoose


module.exports.addcalculator = async (req, res) => {
  try {
    const { year, isHospiceDoSubmitQualityData } = req.body;

    if (!year || isHospiceDoSubmitQualityData === undefined) {
      return res.status(400).json({
        message: "Please provide both 'year' and 'isHospiceDoSubmitQualityData'."
      });
    }

    console.log(`Received year: ${year}, isHospiceDoSubmitQualityData: ${isHospiceDoSubmitQualityData}`);

    // Step 1: Retrieve all cbsa and their wageIndex from the WageIndex database
    const wageIndexes = await WageIndex.find({});

    // Step 2: Get the single HospiceRate document with the provided year and isHospiceDoSubmitQualityData
    const hospiceRateData = await HospiceRate.findOne({ year, isHospiceDoSubmitQualityData });
    console.log('Retrieved HospiceRate data:', hospiceRateData);

    if (!hospiceRateData) {
      return res.status(404).json({ message: "No matching HospiceRate data found for the given year and isHospiceDoSubmitQualityData." });
    }

    const {
      rhcHighWage,
      rhcHighNonWage,
      rhcLowWage,
      rhcLowNonWage,
      chcWage,
      chcNonWage,
      ircWage,
      ircNonWage,
      gipWage,
      gipNonWage
    } = hospiceRateData;

    const calculatorEntries = [];

    // Step 3: For each cbsa present in the WageIndex collection, calculate the rates
    for (const cbsa of wageIndexes) {
      const wageIndex = cbsa.wageIndex;

      const rhcHighRate = wageIndex * rhcHighWage + rhcHighNonWage;
      const rhcLowRate = wageIndex * rhcLowWage + rhcLowNonWage;
      const chcRate = wageIndex * chcWage + chcNonWage;
      const ircRate = wageIndex * ircWage + ircNonWage;
      const gipRate = wageIndex * gipWage + gipNonWage;

      const newCalculatorEntry = {
        cbsa: cbsa.cbsa,
        year,
        wageIndex,
        isHospiceDoSubmitQualityData,
        rhcHighRate,
        rhcLowRate,
        chcRate,
        ircRate,
        gipRate
      };

      // Step 4: Check if an entry with the same year, isHospiceDoSubmitQualityData, and cbsa already exists
      const existingEntry = await HospiceCalculator.findOne({
        year,
        isHospiceDoSubmitQualityData,
        cbsa: cbsa.cbsa
      });

      if (!existingEntry) {
        calculatorEntries.push(newCalculatorEntry);
      } else {
        console.log(`Duplicate entry for cbsa ${cbsa.cbsa}, year ${year} already exists.`);
      }
    }

    if (calculatorEntries.length === 0) {
      return res.status(404).json({ message: "No new calculator entries were added due to duplicates or missing cbsa data." });
    }

    // Save the new calculator entries to the database
    await HospiceCalculator.insertMany(calculatorEntries);

    res.status(201).json({
      message: "HospiceCalculator database created",
      data: calculatorEntries
    });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};



module.exports.searchRate = async (req, res) => {
  try {
    const { year, isHospiceDoSubmitQualityData, cbsa } = req.body;

    // Ensure all three search criteria are present
    if (!year || isHospiceDoSubmitQualityData === undefined || !cbsa) {
      return res.status(400).json({
        message: "All 3 criteria (year, isHospiceDoSubmitQualityData, and cbsa) must be provided."
      });
    }

    console.log('Filter:', { year, isHospiceDoSubmitQualityData, cbsa });

    // Query the database to find matching calculator entries
    const calculatorEntries = await HospiceCalculator.find({
      year,
      isHospiceDoSubmitQualityData,
      cbsa
    });

    if (calculatorEntries.length === 0) {
      return res.status(404).json({ message: "No matching rate data found for the given criteria." });
    }

    res.status(200).json(calculatorEntries);

  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

