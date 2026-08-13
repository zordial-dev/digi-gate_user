import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';

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
      dispatch(actions.setMsg({ type: 'error', text: 'Enter valid 6-digit OTP' }));
      return;
    }
    if (state.otp === '123456' || state.otp === '000000') {
      dispatch(actions.setMsg({ type: 'success', text: 'OTP verified!' }));
      dispatch(actions.setStep('form'));
    } else {
      dispatch(actions.setMsg({ type: 'error', text: 'Invalid OTP. Use 123456' }));
    }
  };

  return (
    <div 
      className="rounded-2xl p-8"
      style={{
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #021767',
        boxShadow: '0 20px 60px rgba(2, 29, 91, 0.25)'
      }}
    >
      <p className="text-sm text-center mb-4" style={{ color: '#3F5885', fontWeight: 500 }}>
        Enter OTP sent to <strong>+91 {state.mobile}</strong>{' '}
        <span
          onClick={() => {
            dispatch(actions.setStep('mobile'));
            dispatch(actions.setMsg(null));
          }}
          style={{
            color: '#153D9F',
            fontWeight: 700,
            cursor: 'pointer',
            marginLeft: '4px',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
          onMouseLeave={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
        >
          (Edit)
        </span>
      </p>
      
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2" style={{ color: '#3F5885' }}>
          6-Digit OTP Code *
        </label>
        <input
          type="text"
          value={state.otp}
          onChange={(e) => dispatch(actions.setOtp(e.target.value.replace(/\D/g, '')))}
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          className="w-full px-4 py-3 border rounded-xl outline-none transition-all text-center text-2xl tracking-[8px]"
          style={{
            borderColor: '#021767',
            color: '#3F5885',
            fontWeight: 700,
            fontSize: '1.1rem',
            letterSpacing: '6px'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#289CD8';
            e.target.style.boxShadow = '0 0 0 3px rgba(40, 156, 216, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#021767';
            e.target.style.boxShadow = 'none';
          }}
        />
        <div className="mt-1 text-xs" style={{ color: '#64748b' }}>
          {state.otp.length}/6 digits entered
        </div>
      </div>

      <div 
        className="mb-4 p-3 rounded-lg text-sm"
        style={{
          background: '#eff6ff',
          color: '#1e40af',
          border: '1px solid #bfdbfe'
        }}
      >
        <span className="font-medium">ℹ️</span> Enter OTP sent to your mobile (or test code 123456)
      </div>
      
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => {
            dispatch(actions.setStep('mobile'));
            dispatch(actions.setMsg(null));
          }}
          className="flex-1 py-3 rounded-xl font-bold transition-all"
          style={{
            border: '1px solid #021767',
            color: '#3F5885',
            background: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(6, 33, 107, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Back
        </button>
        <button 
          onClick={handleVerify}
          disabled={state.otp.length !== 6}
          className="flex-1 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, #153D9F 0%, #06216B 100%)',
            boxShadow: '0 6px 18px rgba(2, 29, 91, 0.2)',
            border: '1px solid #021767'
          }}
          onMouseEnter={(e) => {
            if (state.otp.length === 6) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #06216B 0%, #021D5B 100%)';
            }
          }}
          onMouseLeave={(e) => {
            if (state.otp.length === 6) {
              e.currentTarget.style.background = 'linear-gradient(135deg, #153D9F 0%, #06216B 100%)';
            }
          }}
        >
          Verify OTP
        </button>
      </div>
      
      <button
        onClick={() => {
          dispatch(actions.setOtpTimer(60));
          dispatch(actions.setMsg({ type: 'success', text: 'OTP resent!' }));
        }}
        disabled={state.otpTimer > 0}
        className="text-sm mt-4 block mx-auto font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          color: state.otpTimer > 0 ? '#94a3b8' : '#153D9F'
        }}
        onMouseEnter={(e) => {
          if (state.otpTimer === 0) {
            e.currentTarget.style.textDecoration = 'underline';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textDecoration = 'none';
        }}
      >
        {state.otpTimer > 0 ? `Resend OTP (${state.otpTimer}s)` : 'Resend OTP'}
      </button>
    </div>
  );
}