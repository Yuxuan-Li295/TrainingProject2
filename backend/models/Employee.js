const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String, default: '' },
    preferredName: { type: String, default: '' },
    profilePicture: { type: String, default: '' },
    address: {
        building: { type: String, default: '' },
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        zip: { type: String, default: '' }
    },
    contactInfo: {
        cellPhone: { type: String, default: '' },
        workPhone: { type: String, default: '' }
    },
    email: { type: String, required: true },
    ssn: { type: String, default: '' },
    dob: { type: Date, default: Date.now },
    gender: { type: String, default: '' },
    visaStatus: {
        title: { type: String, default: '' },
        startDate: { type: Date, default: Date.now },
        endDate: { type: Date, default: Date.now }
    },
    emergencyContacts: [{
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        phone: { type: String, default: '' },
        relationship: { type: String, default: '' }
    }],
    documents: [{
        documentType: { type: String, default: '' },
        documentURL: { type: String, default: '' }
    }]
});

module.exports = mongoose.model('Employee', employeeSchema);
