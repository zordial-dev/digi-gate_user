import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';
import { Shield, ArrowRight, ArrowLeft, RefreshCw, KeyRound } from 'lucide-react';

export default function OtpStep() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.visitor);

  useEffect(() => {
    if (state.otpTimer > 0) {
      const timer = setTimeout(() => dispatch(actions.setOtpTimer(state.otpTimer - 1)), 1000);
      return () => clearTimeout(timer);
    }
  }, [state.otpTimer, dispatch]);

  const handleVerify = () => {
    if (!state.otp || state.otp.length !== 6) {
      dispatch(actions.setMsg({ type: 'error', text: 'Please enter valid 6-digit OTP code' }));
      return;
    }
    if (state.otp === '123456' || state.otp === '000000') {
      dispatch(actions.setMsg({ type: 'success', text: 'OTP code verified successfully!' }));
      dispatch(actions.setStep('form'));
    } else {
      dispatch(actions.setMsg({ type: 'error', text: 'Invalid OTP code. Please enter 123456 for test' }));
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xl shadow-[#035352]/10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-[#035352]/10 text-[#035352] flex items-center justify-center mx-auto mb-2">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#172525]">Enter Verification Code</h2>
        <p className="text-xs text-slate-500 font-semibold">
          Sent to <strong className="text-[#172525]">+91 {state.mobile}</strong>{' '}
          <button
            onClick={() => {
              dispatch(actions.setStep('mobile'));
              dispatch(actions.setMsg(null));
            }}
            className="text-[#035352] font-extrabold hover:underline ml-1"
          >
            (Edit)
          </button>
        </p>
      </div>

      <div>
        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5 text-center">
          6-Digit OTP Code *
        </label>
        <input
          type="text"
          value={state.otp}
          onChange={(e) => dispatch(actions.setOtp(e.target.value.replace(/\D/g, '')))}
          maxLength={6}
          placeholder="••••••"
          className="w-full px-4 py-3 border border-slate-300 rounded-2xl outline-none text-center text-xl font-mono font-extrabold text-slate-800 placeholder-slate-300 tracking-[8px] focus:border-[#035352] focus:ring-2 focus:ring-[#035352]/20 transition-all shadow-sm"
        />
        <div className="mt-1.5 text-center text-[11px] font-semibold text-slate-400">
          {state.otp.length}/6 digits entered
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-[#035352]/5 border border-[#035352]/20 text-xs font-bold text-[#035352] flex items-center gap-2">
        <Shield className="w-4 h-4 shrink-0 text-[#035352]" />
        <span>Use verification OTP code <strong>123456</strong> for testing.</span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            dispatch(actions.setStep('mobile'));
            dispatch(actions.setMsg(null));
          }}
          className="flex-1 py-3.5 rounded-2xl font-bold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <button 
          onClick={handleVerify}
          disabled={state.otp.length !== 6}
          className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-[#035352] hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 text-xs uppercase tracking-wider"
        >
          <span>Verify OTP</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center pt-1">
        <button
          onClick={() => {
            dispatch(actions.setOtpTimer(60));
            dispatch(actions.setMsg({ type: 'success', text: 'OTP code resent successfully!' }));
          }}
          disabled={state.otpTimer > 0}
          className="text-xs font-bold text-[#035352] hover:underline disabled:opacity-50 disabled:no-underline inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{state.otpTimer > 0 ? `Resend Code in ${state.otpTimer}s` : 'Resend Verification Code'}</span>
        </button>
      </div>
    </div>
  );
}