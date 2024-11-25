// models/noticeOfElection.js
const mongoose = require('mongoose');
const { validateDate } = require('../utils/validation'); // Adjust the path as necessary




const claimSchema = new mongoose.Schema({
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
    typeOfService: {
        type: String,
        enum: ['Hospice Service', 'Room and Board Claims', 'Home Health Claims', 'ALW Billing'], // Enum for type of service
        required: true
    },
    noaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BatchedNoa', // Reference to Noa model
        required: true
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
        enum: ['811', '812', '813', '814', '329'], // Enum for type of admission: 81A OR 81C
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
module.exports = mongoose.model('Claim', claimSchema);






