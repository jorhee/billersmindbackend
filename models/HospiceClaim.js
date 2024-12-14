// models/noticeOfElection.js
const mongoose = require('mongoose');
const { validateDate } = require('../utils/validation'); // Adjust the path as necessary




const hospiceClaimSchema = new mongoose.Schema({
    noa: {
        noaId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BatchedNoa', // Reference to Noa model
            required: true
        },
        admitDate: {
            type: String,
            required: true,
        }
    },
    provider: {
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Provider', // Reference to Provider model
            required: true
        },
        name: {
            type: String,
            required: true,
        },
    },
    patient: {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient', // Reference to Patient model
            required: true
        },
        lastName: {
            type: String,
            required: [true, 'lastName is required'],
        },
        firstName: {
            type: String,
            required: [true, 'firstName is required'],
        },
    },
    placeOfService: {
        type: String,
        enum: ['HOME', 'ALF', 'SNF', 'BNC'], // Enum for place of service
        required: false
    },
    payer: {
        payerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payer', // Reference to Payer model
            required: true
        },
        name: {
            type: String,
            required: true,
        },
    },
    memberId: {
        type: String,
        required: true
    },
    typeOfService: {
        type: String,
        required: true,
        default: 'Hospice Service'
    },
    fromDate: {
        type: String,
        required: false,
        validate: {
            validator: validateDate,
            message: 'Invalid date format for from date.'
        }
    },
    truDate: {
        type: String,
        required: false,
        validate: {
            validator: validateDate,
            message: 'Invalid date format for Tru date.'
        }
    },
    days: {
        type: Number,
        required: true
    },
    typeOfBill: {
        type: String,
        required: true,
    },
    sentDate: {
        type: String,
        required: false,
    },
    expectedAmount: {
        type: Number,
        required: true,
    },
    debitAmount: {
        type: Number,
        required: false,
    },
    paidAmount: {
        type: Number,
        required: false,
    },
    paidDate: {
        type: String,
        required: false,
    },
    claimStatus:{
        type: String,
        required: false,
        default: 'Pending'
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
    }],
    fiscalYear: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Create the model
module.exports = mongoose.model('HospiceClaim', hospiceClaimSchema);






