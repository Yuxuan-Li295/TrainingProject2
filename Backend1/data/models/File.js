const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  mimetype: { type: String, required: true }, 
  uploadedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
