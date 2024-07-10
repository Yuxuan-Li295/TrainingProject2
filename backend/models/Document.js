const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    documentType: { type: String, required: true },
    documentURL: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    uploadedDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
