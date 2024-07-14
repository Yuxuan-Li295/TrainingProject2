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
export enum currentVisaStepEnum {
  NOT_STARTED= 'not_started',
  RECEIPT='receipt',  // OPT收据阶段
  EAD_CARD= 'ead_card',  // EAD卡阶段
  I983='i983',  // I-983表格阶段
  I20= 'i20',  // I-20表格阶段
  COMPLETE= 'complete'  // 完成所有步骤
}
export enum visaStepStatusEnum {
  NOT_SUBMITTED= 'not_submitted', // 尚未提交
  SUBMITTED='submitted',  // 已提交
  APPROVED= 'approved',  // 已批准
  REJECTED='rejected',  // 已拒绝
}
export enum visaStepNextEnum {
  NOT_STARTED= '提交入职申请',
  RECEIPT_APPLY='提交OPT收据申请',  
  RECEIPT_VERIFY= '等待OPT收据审核',  
  EAD_CARD_APPLY='提交EAD卡申请',  
  EAD_CARD_VERIFY= '等待EAD卡审核', 
  I983_APPLY='提交I-983表格申请',  
  I983_VERIFY= '等待I-983表格审核', 
  I20_APPLY='提交I-20表格申请',  
  I20_VERIFY= '等待I-20表格审核', 
}

export interface UserDataType {
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
export interface DataType {
  name: string;
  email: string;
  status: string;
  key: string;
  user:UserDataType,
  onboardingStatus: {
    currentStep:string,
    eadCardStatus:string,
    i20Status:string,
    i983Status:string,
    receiptStatus:string,
  },
  _id?: string;
}