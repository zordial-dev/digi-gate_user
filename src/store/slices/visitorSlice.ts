import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VisitorState {
  org: any;
  form: {
    full_name: string;
    designation: string;
    company: string;
    location: string;
    email: string;
    linkedin: string;
    mobile_number: string;
    purpose_of_visit: string;
    reference: string;
  };
  mobile: string;
  otp: string;
  otpTimer: number;
  hostId: string;
  selfiePreview: string | null;
  isReturning: boolean;
  visitorId: number | null;
  step: 'mobile' | 'otp' | 'form';
  tab: number;
  showConfirm: boolean;
  confirmData: any;
  loading: boolean;
  errors: Record<string, string>;
  msg: { type: 'success' | 'error'; text: string } | null;
}

const initialState: VisitorState = {
  org: null, 
  form: {
    full_name: '',
    designation: '',
    company: '',
    location: '',
    email: '',
    linkedin: '',
    mobile_number: '',
    purpose_of_visit: '',
    reference: '',
  },
  mobile: '',
  otp: '',
  otpTimer: 0,
  hostId: '',
  selfiePreview: null,
  isReturning: false,
  visitorId: null,
  step: 'mobile',
  tab: 0,
  showConfirm: false,
  confirmData: null,
  loading: false,
  errors: {},
  msg: null,
};

const slice = createSlice({
  name: 'visitor',
  initialState,
  reducers: {
    setOrg: (state, action: PayloadAction<any>) => {
      state.org = action.payload;
    },
    setForm: (state, action: PayloadAction<Partial<VisitorState['form']>>) => {
      state.form = { ...state.form, ...action.payload };
    },
    setMobile: (state, action: PayloadAction<string>) => {
      state.mobile = action.payload;
    },
    setOtp: (state, action: PayloadAction<string>) => {
      state.otp = action.payload;
    },
    setOtpTimer: (state, action: PayloadAction<number>) => {
      state.otpTimer = action.payload;
    },
    setHostId: (state, action: PayloadAction<string>) => {
      state.hostId = action.payload;
    },
    setSelfiePreview: (state, action: PayloadAction<string | null>) => {
      state.selfiePreview = action.payload;
    },
    setIsReturning: (state, action: PayloadAction<boolean>) => {
      state.isReturning = action.payload;
    },
    setVisitorId: (state, action: PayloadAction<number | null>) => {
      state.visitorId = action.payload;
    },
    setStep: (state, action: PayloadAction<'mobile' | 'otp' | 'form'>) => {
      state.step = action.payload;
    },
    setTab: (state, action: PayloadAction<number>) => {
      state.tab = action.payload;
    },
    setShowConfirm: (state, action: PayloadAction<boolean>) => {
      state.showConfirm = action.payload;
    },
    setConfirmData: (state, action: PayloadAction<any>) => {
      state.confirmData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload;
    },
    setMsg: (state, action: PayloadAction<{ type: 'success' | 'error'; text: string } | null>) => {
      state.msg = action.payload;
    },
    clearMsg: (state) => {
      state.msg = null;
    },
    reset: () => initialState,
  },
});

export const actions = slice.actions;
export default slice.reducer;