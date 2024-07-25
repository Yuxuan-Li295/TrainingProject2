export interface IResult {
  data:{
    Code: number,
    Msg: string
  }
}
export interface IQuery {
  firstName?: string
  lastName?: string
  preferredName?: string
}
export interface IOnboardingStatus {
  currentStep:string,
  eadCardStatus:string,
  i20Status:string,
  i983Status:string,
  receiptStatus:string,
  currentFeedback:string,
}
export enum currentVisaStepEnum {
  NOT_STARTED= 'not_started',
  RECEIPT='receipt',  // OPT收据阶段
  EAD_CARD= 'ead_card',  // EAD卡阶段
  I983='i983',  // I-983表格阶段
  I20= 'i20',  // I-20表格阶段
  COMPLETE= 'complete'  // 完成所有步骤
}
export enum VisaStepEnum {
  RECEIPT='receipt',  // OPT收据阶段
  EAD_CARD= 'ead_card',  // EAD卡阶段
  I983='i983',  // I-983表格阶段
  I20= 'i20',  // I-20表格阶段
}
export enum visaStepStatusEnum {
  NOT_SUBMITTED= 'not_submitted', // 尚未提交
  SUBMITTED='submitted',  // 已提交
  APPROVED= 'approved',  // 已批准
  REJECTED='rejected',  // 已拒绝
}
export enum visaStepNextEnum {
  NOT_STARTED = 'Submit Onboarding',
  RECEIPT_APPLY = 'Submit OPT Receipt',
  RECEIPT_VERIFY = 'Wait for OPT Verification',
  EAD_CARD_APPLY = 'Submit EAD Card',
  EAD_CARD_VERIFY = 'Wait for EAD Verification',
  I983_APPLY = 'Submit I-983',
  I983_VERIFY = 'Wait for I-983 Verification',
  I20_APPLY = 'Submit I-20',
  I20_VERIFY = 'Wait for I-20 Verification',
}



export interface UserDataType {
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  preferredName?: string;
  ssn?: string;
  dob?: string;
  gender?: string;
  profilePicture?: string;

  workAuthorization?: {
    title?: string;
    startDate?: Date;
    endDate?: Date;
  },
  address?: {
    building?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  },
  contactInfo?: {
    cellPhone?: string;
    workPhone?: string;
  }
}
export interface IDocuments {
  RECEIPT?:{ type: [
      {
        name: { type: String, required: true },
        id: { type: String, required: true }
      }
    ],
    default: [] },
  EAD_CARD?:{ type: [
      {
        name: { type: String, required: true },
        id: { type: String, required: true }
      }
    ],
    default: [] },
  I983_FORM?:{ type: [
      {
        name: { type: String, required: true },
        id: { type: String, required: true }
      }
    ],
    default: [] },
  I20_FORM?:{ type: [
      {
        name: { type: String, required: true },
        id: { type: String, required: true }
      }
    ],
    default: [] },
  OTHERS?:{ type: [
      {
        name: { type: String, required: true },
        id: { type: String, required: true }
      }
    ],
    default: [] },
}

export interface DataType {
  name: string;
  email: string;
  status: string;
  key: string;
  starttime?:string,
  endtime?:string,
  day?:string,
  user:UserDataType,
  onboardingStatus: IOnboardingStatus,
  documents:IDocuments,
  _id?: string;
}