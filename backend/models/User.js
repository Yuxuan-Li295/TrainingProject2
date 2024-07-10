const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true },
    registrationToken: { type: String, default: '' },
    tokenExpires: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
