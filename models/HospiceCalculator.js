const mongoose = require('mongoose');

const HospiceCalculatorSchema = new mongoose.Schema(
  {
    cbsa: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    wageIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    isHospiceDoSubmitQualityData: {
      type: Boolean,
      required: true,
    },
    rhcHighRate: {
      type: Number,
      required: true,
      min: 0,
    },
    rhcLowRate: {
      type: Number,
      required: true,
      min: 0,
    },
    chcRate: {
      type: Number,
      required: true,
      min: 0,
    },
    ircRate: {
      type: Number,
      required: true,
      min: 0,
    },
    gipRate: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

module.exports = mongoose.model('HospiceCalculator', HospiceCalculatorSchema);
