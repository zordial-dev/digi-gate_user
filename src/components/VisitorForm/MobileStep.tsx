import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';
import { visitorApi } from '@/api/services';
import { Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function MobileStep() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.visitor);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!state.mobile || state.mobile.length !== 10) {
      dispatch(actions.setMsg({ type: 'error', text: 'Please enter a valid 10-digit mobile number' }));
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
        dispatch(actions.setMsg({ type: 'success', text: 'Enter verification OTP code sent to your mobile' }));
      }
      dispatch(actions.setStep('otp'));
    } catch {
      dispatch(actions.setMsg({ type: 'error', text: 'Network connection error' }));
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xl shadow-[#035352]/10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-[#035352]/10 text-[#035352] flex items-center justify-center mx-auto mb-2">
          <Phone className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#172525]">Mobile Verification</h2>
        <p className="text-xs text-slate-500 font-medium">Quick OTP verification to verify your visitor profile</p>
      </div>

      <div>
        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
          Mobile Number *
        </label>
        <div className="flex items-center">
          <span className="px-3.5 py-3 border border-r-0 border-slate-300 rounded-l-2xl font-bold text-xs bg-slate-50 text-slate-700">
            +91
          </span>
          <input
            type="tel"
            value={state.mobile}
            onChange={(e) => dispatch(actions.setMobile(e.target.value.replace(/\D/g, '')))}
            maxLength={10}
            placeholder="Enter 10-digit mobile number"
            className="w-full px-4 py-3 border border-slate-300 rounded-r-2xl outline-none text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-[#035352] focus:ring-2 focus:ring-[#035352]/20 transition-all shadow-sm"
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span>Standard 10-digit mobile number</span>
          <span className={state.mobile.length === 10 ? 'text-[#035352] font-bold' : ''}>
            {state.mobile.length}/10 digits
          </span>
        </div>
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={loading || state.mobile.length !== 10}
        className="w-full py-3.5 rounded-2xl font-bold text-white bg-[#035352] hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-wider"
      >
        <span>{loading ? 'Sending Verification Code...' : 'Send Verification OTP'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <div className="pt-2 text-center text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#035352]" />
        <span>Secure OTP verification for visitor security</span>
      </div>
    </div>
  );
}