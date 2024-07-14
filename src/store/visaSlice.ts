import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VisaState {
  optReceipt: string;
  optEad: string;
  i983: string;
  i20: string;
  feedback: string;
}

const initialState: VisaState = {
  optReceipt: 'unsubmitted',
  optEad: 'unsubmitted',
  i983: 'unsubmitted',
  i20: 'unsubmitted',
  feedback: '',
};

const visaSlice = createSlice({
  name: 'visa',
  initialState,
  reducers: {
    setVisaStatus(state, action: PayloadAction<Partial<VisaState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setVisaStatus } = visaSlice.actions;
export default visaSlice.reducer;