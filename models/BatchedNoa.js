// models/noticeOfElection.js
const mongoose = require('mongoose');
const { validateDate } = require('../utils/validation'); // Adjust the path as necessary




const batchedNoaSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider', // Reference to Provider model
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient', // Reference to Patient model
        required: true
    },
    placeOfService: {
        type: String,
        enum: ['HOME', 'ALF', 'SNF', 'BNC'], // Enum for place of service
        required: false
    },
    payerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payer', // Reference to Payer model
        required: true
    },
    memberId: {
        type: String,
        required: true
    },
    admitDate: {
        type: String,
        required: true,
        validate: {
            validator: validateDate,
            message: 'Invalid date format for admitDate.'
        }
    },
    typeOfBill: {
        type: String,
        required: true,
        enum: ['81A', '81C', '81B', '81D'], // Enum for type of admission: 81A OR 81C
    },
    benefitPeriod: [{
        benefitNum: {
        type: Number,
        required: true
    },
    BeneStartDate: {
        type: String,
        required: true,
        validate: {
            validator: validateDate,
            message: 'Invalid date format for BeneStartDate.'
        }
    },
    BeneTermDate: {
        type: String,
        required: true,
    }
    }],
    primaryDiagnosis: {
        type: String,
        required: true
    },
    AttMd: {
        lastName: {
            type: String,
            required: true,
            set: v => v ? v.toUpperCase() : v // Convert to uppercase if the value exists
        },
        firstName: {
            type: String,
            required: true,
            set: v => v ? v.toUpperCase() : v // Convert to uppercase if the value exists
        },
        npi: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^\d{10}$/.test(v); // Validate NPI to be 10 digits only
                },
                message: 'NPI must be a 10-digit number.'
            }
        }
    },
    sentDate: {
        type: String,
        required: false,
    },
    finalizedDate: {
        type: String,
        required: false,
        validate: {
            validator: validateDate,
            message: 'Invalid date format for BeneStartDate.'
        }
    },
    noaStatus:{
        type: String,
        required: false,
        default: 'Initially sent'
    },
    dcDate: {
        type: String,
        required: false,
        validate: {
            validator: validateDate,
            message: 'Invalid date format for BeneStartDate.'
        }
    },
    dcReason: {
        type: String,
        required: false,
        enum: ['Revoked.', 'Death.', 'Transfer to other Hospice.', 'Moves out of serice area.', 'No longer terminally ill.', 'Discharge for a cause.']
    },
    isNoaLate: {
        type: Boolean,
        default: false,
        required: false
    },
    comments: [{
       remarks: {
        type: String,
        required: false,        
       },
       actions:{
        type: String,
        required: false, 
       },
       status: {
        type: String,
        required: false,
        enum: ['In-progress', 'Closed', 'Resolved'],
        default: 'In-progress'
       },
       userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: false
        },
       date: {
        type: String,
        default: Date.now,
        required: false
       },
    }]

}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create the model
module.exports = mongoose.model('BatchedNoa', batchedNoaSchema);






