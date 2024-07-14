const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    name: String,
    account: { type: String, unique: true }, //unique 唯一键
    password: String,
    firstName: { type: String, required: true }, // ******
    lastName: { type: String, required: true }, // ******
    middleName: { type: String, default: '' }, // ******
    preferredName: { type: String, required: true }, // ******
    profilePicture: { type: String, default: '' }, //头像照片 ******
    address: {
      //地址 ******
      building: { type: String, default: '' },
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zip: { type: String, default: '' }
    },
    contactInfo: {
      //联系方式手机号座机号 ******
      cellPhone: { type: String, default: '' },
      workPhone: { type: String, default: '' }
    },
    email: { type: String, required: true }, //******
    ssn: { type: String, default: '' }, //社会保险号 ******
    dob: { type: Date, default: Date.now }, //生日 ******
    gender: { type: String, default: '' }, //性别 ******
    workAuthorization: {
      //工作授权头衔 ******
      title: { type: String, default: '' },
      startDate: { type: Date, default: Date.now },
      endDate: { type: Date, default: Date.now }
    }
  },
  { timestamps: true, versionKey: false }
)

module.exports = mongoose.model('User', schema)
