const mongoose = require('mongoose');

// Define the Payer Schema
const payerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        set: v => v ? v.toUpperCase() : v // Convert to uppercase only if value exists
    },
    address: {
        Address: {
            type: String,
            set: v => v ? v.toUpperCase() : v // Convert to uppercase only if value exists
        },
        City: {
            type: String,
            set: v => v ? v.toUpperCase() : v // Convert to uppercase only if value exists
        },
        State: {
            type: String,
            set: v => v ? v.toUpperCase() : v // Convert to uppercase only if value exists
        },
        Zip: {
            type: String,
        }
    },
    payerId: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    fax: {
        type: String,
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});


module.exports = mongoose.model('Payer', payerSchema);