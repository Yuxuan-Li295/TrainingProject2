const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    name: String,
    account: { type: String, unique: true }, //unique Key
    password: String,
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String, default: '' },
    preferredName: { type: String, required: true },
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
    workAuthorization: {
      title: { type: String, default: '' },
      startDate: { type: Date, default: Date.now },
      endDate: { type: Date, default: Date.now }
    },
      userDocuments: {
          type: [
              {
                  name: { type: String, required: true },
                  id: { type: String, required: true }
              }
          ],
          default: []
      },
  },
  { timestamps: true, versionKey: false }
)

module.exports = mongoose.model('User', schema)
