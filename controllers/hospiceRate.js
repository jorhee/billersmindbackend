const HospiceRate = require("../models/HospiceRate");
const User = require('../models/User');

const mongoose = require('mongoose');  // Import mongoose

module.exports.addHospiceRate = async (req, res) => {

	try {
	    const {
	      year,
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
	    } = req.body;

	    const newHospiceRate = await HospiceRate.create({
	      year,
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
	    });

	    res.status(201).json(newHospiceRate);
	  } catch (error) {
	    res.status(500).json({ message: 'Server error', error });
	  }

};