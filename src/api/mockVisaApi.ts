const mockVisaStatus = {
  optReceipt: 'approved',
  optEad: 'approved',
  i983: 'approved',
  i20: 'rejected',
  feedback: 'Your OPT Receipt has been approved. Please upload your OPT EAD.',
};

export const fetchVisaStatus = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { visa: mockVisaStatus };
};

export const submitDocument = async (fileType: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { status: 'submitted' }; // 模拟提交后的状态
};
