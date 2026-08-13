import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';
import { visitorApi } from '@/api/services';

export default function MobileStep() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.visitor);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!state.mobile || state.mobile.length !== 10) {
      dispatch(actions.setMsg({ type: 'error', text: 'Enter valid 10-digit number' }));
      return;
    }
    setLoading(true);
    try {
      const res = await visitorApi.check(state.mobile, 1);
      const result = res.data;

      if (result.success && result.isReturning && result.data) {
        const d = result.data;
        dispatch(actions.setIsReturning(true));
        dispatch(actions.setVisitorId(d.id));
        dispatch(actions.setForm({
          full_name: d.full_name || '',
          designation: d.designation || '',
          company: d.company || '',
          location: d.location || '',
          email: d.email || '',
          linkedin: d.linkedin || '',
          mobile_number: d.mobile_number || '',
        }));
      } else {
        dispatch(actions.setIsReturning(false));
        dispatch(actions.setVisitorId(null));
        dispatch(actions.setForm({ mobile_number: state.mobile }));
        dispatch(actions.setMsg({ type: 'success', text: 'Verify your OTP' }));
      }
      dispatch(actions.setStep('otp'));
    } catch {
      dispatch(actions.setMsg({ type: 'error', text: 'Network error' }));
    }
    setLoading(false);
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
      <div className="mb-4">
        <label className="block text-sm font-semibold mb-2" style={{ color: '#3F5885' }}>
          Mobile Number *
        </label>
        <div className="flex items-center">
          <span 
            className="px-3 py-3 border rounded-l-lg border-r-0 font-bold"
            style={{
              borderColor: '#021767',
              color: '#1e293b',
              background: '#f8fafc'
            }}
          >
            +91
          </span>
          <input
            type="tel"
            value={state.mobile}
            onChange={(e) => dispatch(actions.setMobile(e.target.value.replace(/\D/g, '')))}
            maxLength={10}
            placeholder="Enter 10-digit number"
            className="w-full px-4 py-3 border rounded-r-lg outline-none transition-all"
            style={{
              borderColor: '#021767',
              color: '#3F5885',
              fontWeight: 500,
              fontSize: '0.95rem'
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
        </div>
        <div className="mt-1 text-xs" style={{ color: '#64748b' }}>
          {state.mobile.length}/10 digits entered
        </div>
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={loading || state.mobile.length !== 10}
        className="w-full py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50"
        style={{
          background: 'linear-gradient(135deg, #153D9F 0%, #06216B 100%)',
          boxShadow: '0 6px 18px rgba(2, 29, 91, 0.2)',
          border: '1px solid #021767',
          fontSize: '1rem'
        }}
        onMouseEnter={(e) => {
          if (!loading && state.mobile.length === 10) {
            e.currentTarget.style.background = 'linear-gradient(135deg, #06216B 0%, #021D5B 100%)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.background = 'linear-gradient(135deg, #153D9F 0%, #06216B 100%)';
          }
        }}
      >
        {loading ? 'Checking...' : 'Send Verification OTP'}
      </button>
    </div>
  );
}