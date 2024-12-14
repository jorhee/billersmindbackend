const mongoose = require('mongoose');

const WageIndexSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
    trim: true
  },	
  fipsCode: {
    type: String,
    required: true,
    trim: true
  },
  oldCountyName: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 2
  },
  cbsa: {
    type: String,
    required: true,
    trim: true
  },
  newCountyName: {
    type: String,
    required: true,
    trim: true
  },
  wageIndex: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('WageIndex', WageIndexSchema);