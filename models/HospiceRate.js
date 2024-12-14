const mongoose = require('mongoose');

const HospiceRateSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
    trim: true
  },
  isHospiceDoSubmitQualityData: {
  	type: Boolean,
  	required: true,
  	default: false
  },	
  rhcHighWage: {
    type: Number,
    required: true,
    min: 0
  },
  rhcHighNonWage: {
    type: Number,
    required: true,
    min: 0
  },
  rhcLowWage: {
    type: Number,
    required: true,
    min: 0
  },
  rhcLowNonWage: {
    type: Number,
    required: true,
    min: 0
  },
  chcWage: {
    type: Number,
    required: true,
    min: 0
  },
  chcNonWage: {
    type: Number,
    required: true,
    min: 0
  },
  ircWage: {
    type: Number,
    required: true,
    min: 0
  },
  ircNonWage: {
    type: Number,
    required: true,
    min: 0
  },
  gipWage: {
    type: Number,
    required: true,
    min: 0
  },
  gipNonWage: {
    type: Number,
    required: true,
    min: 0
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('HospiceRate', HospiceRateSchema);