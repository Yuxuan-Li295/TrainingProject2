const mongoose = require('mongoose');

const visaStepStatusEnum = {
    NOT_SUBMITTED: 'not_submitted',  // 尚未提交
    SUBMITTED: 'submitted',  // 已提交
    APPROVED: 'approved',  // 已批准
    REJECTED: 'rejected'  // 已拒绝
};

const currentVisaStepEnum = {
    NOT_STARTED: 'not_started',
    RECEIPT: 'receipt',  // OPT收据阶段
    EAD_CARD: 'ead_card',  // EAD卡阶段
    I983: 'i983',  // I-983表格阶段
    I20: 'i20',  // I-20表格阶段
    COMPLETE: 'complete'  // 完成所有步骤
};

const documentDetailSchema = new mongoose.Schema({
    documentURL: { type: String, required: true },
    uploadedDate: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    description: { type: String, default: '' } // Optional description for the document
});

const documentsSchema = new mongoose.Schema({
    RECEIPT: { type: [documentDetailSchema], default: [] },
    EAD_CARD: { type: [documentDetailSchema], default: [] },
    I983_FORM: { type: [documentDetailSchema], default: [] },
    I20_FORM: { type: [documentDetailSchema], default: [] },
    OTHERS: { type: [documentDetailSchema], default: [] } // For miscellaneous or additional documents
});

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
    documents: { type: documentsSchema, default: () => ({}) },
    onboardingStatus: {
        currentStep: { type: String, enum: Object.values(currentVisaStepEnum), default: currentVisaStepEnum.NOT_STARTED },
        receiptStatus: { type: String, enum: Object.values(visaStepStatusEnum), default: visaStepStatusEnum.NOT_SUBMITTED },
        eadCardStatus: { type: String, enum: Object.values(visaStepStatusEnum), default: visaStepStatusEnum.NOT_SUBMITTED },
        i983Status: { type: String, enum: Object.values(visaStepStatusEnum), default: visaStepStatusEnum.NOT_SUBMITTED },
        i20Status: { type: String, enum: Object.values(visaStepStatusEnum), default: visaStepStatusEnum.NOT_SUBMITTED }
    }
});

module.exports = mongoose.model('Employee', employeeSchema);
