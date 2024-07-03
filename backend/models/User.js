const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true },
    role: { type: String, enum: ['employee', 'hr'], default: 'employee' },
    registrationToken: { type: String, default: '' },
    tokenExpires: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
