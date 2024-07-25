const mongoose = require('mongoose')

const visaStepStatusEnum = {
  NOT_SUBMITTED: 'not_submitted', // Not yet submitted
  SUBMITTED: 'submitted', // Alread submitted
  APPROVED: 'approved', // Already approved
  REJECTED: 'rejected' // Already rejected
}

const statusEnum = {
  NOT_SUBMITTED: 'not_submitted', // Not yet submitted
  SUBMITTED: 'submitted', // Submitted
  APPROVED: 'approved', // Approved
  REJECTED: 'rejected', // Rejected
  COMPLETE: 'complete' // Complete all the steps
}

const currentVisaStepEnum = {
  NOT_STARTED: 'not_started',
  RECEIPT: 'receipt', // OPT Receipt stage
  EAD_CARD: 'ead_card', // EAD Card Stage
  I983: 'i983', // I-983 Table Stage
  I20: 'i20', // I-20 Table Stage
  COMPLETE: 'complete' // Completed all the steps
}

const documentsSchema = new mongoose.Schema({
  RECEIPT: { type: [
      {
        name: { type: String, required: true },
        id: { type: String, required: true }
      }
    ],
    default: [] },
  EAD_CARD: { type: [
      {
        name: { type: String, required: true },
        id: { type: String, required: true }
      }
    ],
    default: [] },
  I983_FORM: { type: [
      {
        name: { type: String, required: true },
        id: { type: String, required: true }
      }
    ],
    default: [] },
  I20_FORM: { type: [
      {
        name: { type: String, required: true },
        id: { type: String, required: true }
      }
    ],
    default: [] },
  OTHERS: { type: [
      {
        name: { type: String, required: true },
        id: { type: String, required: true }
      }
    ],
    default: [] } // For miscellaneous or additional documents
})

const schema = new mongoose.Schema(
  {
    id: { type: String, unique: true }, //unique key
    starttime: String,
    endtime: String,
    day: String,
    status: { type: String, default: statusEnum.NOT_SUBMITTED },
    emergencyContacts: [
      {
        //***** */
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        phone: { type: String, default: '' },
        relationship: { type: String, default: '' }
      }
    ],
    documents: { type: documentsSchema, default: () => ({}) },
    onboardingStatus: {
      currentStep: {
        type: String,
        enum: Object.values(currentVisaStepEnum),
        default: currentVisaStepEnum.NOT_STARTED
      },
      receiptStatus: {
        type: String,
        enum: Object.values(visaStepStatusEnum),
        default: visaStepStatusEnum.NOT_SUBMITTED
      },
      eadCardStatus: {
        type: String,
        enum: Object.values(visaStepStatusEnum),
        default: visaStepStatusEnum.NOT_SUBMITTED
      },
      i983Status: {
        type: String,
        enum: Object.values(visaStepStatusEnum),
        default: visaStepStatusEnum.NOT_SUBMITTED
      },
      i20Status: {
        type: String,
        enum: Object.values(visaStepStatusEnum),
        default: visaStepStatusEnum.NOT_SUBMITTED
      },
      currentFeedback: {
        type: String,
        default: ''
      }
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true, versionKey: false }
)

module.exports = mongoose.model('Record', schema)
