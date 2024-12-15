const mongoose = require('mongoose');

const ZipcodeSchema = new mongoose.Schema({
  zip: {
    type: String, // ZIP codes may contain leading zeros, so string is preferred
    required: true,
    unique: true, // Ensures no duplicate ZIP codes
    trim: true,
    match: [/^\d{5}$/, 'ZIP code must be a 5-digit number'] // Ensures only 5-digit numbers
  },
  type: {
    type: String,
    enum: ['STANDARD', 'PO BOX', 'UNIQUE'], // Example categories, update as needed
    trim: true
  },
  primary_city: {
    type: String,
    required: true,
    trim: true
  },
  acceptable_cities: {
    type: [String], // Array of acceptable city names
    default: []
  },
  state: {
    type: String,
    required: true,
    trim: true,
    minlength: 2, // For state abbreviations like "CA", "NY"
    maxlength: 2
  },
  county: {
    type: String,
    required: true,
    trim: true
  },
  newCountyName: {
    type: String,
    required: true,
    trim: true,
  },
  cbsa: {
    type: String, // Core-Based Statistical Area code, often numeric but stored as a string
    required: true,
    trim: true,
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Zipcode', ZipcodeSchema);