import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';
import { invitationApi, visitorApi } from '@/api/services';
import { KeyRound, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function InvitationStep() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.visitor);
  const [code, setCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [fallingBackToOtp, setFallingBackToOtp] = useState(false);

  const cleanCode = code.trim().toUpperCase();

  const handleValidate = async () => {
    if (!cleanCode) {
      dispatch(actions.setMsg({ type: 'error', text: 'Please enter your invitation code' }));
      return;
    }

    setValidating(true);
    dispatch(actions.setMsg(null));

    try {
      const orgIdToUse = state.org?.id || 1;
      const res = await invitationApi.validateCode({
        mobile_number: state.mobile,
        invitation_code: cleanCode,
        organisation_id: orgIdToUse,
      });

      if (res.data.success && res.data.data) {
        const inv = res.data.data;

        // Pre-fill form details from validated invitation
        dispatch(actions.setIsInvited(true));
        dispatch(actions.setInvitationCode(inv.invitation_code));
        dispatch(actions.setInvitationData(inv));
        dispatch(actions.setInvitationNotes(inv.additional_notes || ''));
        dispatch(actions.setHostId(String(inv.host_id)));
        dispatch(actions.setVisitorId(inv.visitor_id || null));
        dispatch(actions.setForm({
          full_name: inv.visitor_name,
          mobile_number: inv.mobile_number,
          purpose_of_visit: inv.purpose_of_visit,
          reference: inv.invitation_code,
        }));

        dispatch(actions.setStep('form'));
        dispatch(actions.setMsg({
          type: 'success',
          text: `Invitation verified! Welcome, ${inv.visitor_name}. Please review your details.`
        }));
      } else {
        dispatch(actions.setMsg({ type: 'error', text: res.data.error || 'Invalid invitation code' }));
      }
    } catch (err: any) {
      console.error('Validation error:', err);
      const errMsg = err.response?.data?.error || err.message || 'Failed to validate invitation code. Please check and try again.';
      dispatch(actions.setMsg({ type: 'error', text: errMsg }));
    } finally {
      setValidating(false);
    }
  };

  const handleFallbackToStandardOtp = async () => {
    setFallingBackToOtp(true);
    dispatch(actions.setMsg(null));

    try {
      // 1. Send OTP
      const otpRes = await visitorApi.sendOtp(state.mobile);
      if (!otpRes.data.success) {
        dispatch(actions.setMsg({ type: 'error', text: otpRes.data.error || 'Failed to send OTP' }));
        setFallingBackToOtp(false);
        return;
      }

      // 2. Check if returning visitor
      const orgIdToUse = state.org?.id || 1;
      const res = await visitorApi.check(state.mobile, orgIdToUse);
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
      }

      dispatch(actions.setIsInvited(false));
      dispatch(actions.setOtpTimer(60));
      dispatch(actions.setStep('otp'));
      dispatch(actions.setMsg({ type: 'success', text: 'Verification code sent to your mobile number' }));
    } catch (err: any) {
      const errMsg = err.response?.data?.error || 'Failed to send OTP. Please try again.';
      dispatch(actions.setMsg({ type: 'error', text: errMsg }));
    } finally {
      setFallingBackToOtp(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xl shadow-[#035352]/10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#035352] border border-teal-200/80 flex items-center justify-center mx-auto mb-2">
          <KeyRound className="w-6 h-6" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#035352] text-[11px] font-extrabold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Invitation Found</span>
        </div>
        <h2 className="text-lg font-bold text-[#172525]">Enter Invitation Code</h2>
        <p className="text-xs text-slate-500 font-medium">
          A pre-approved pass is linked to <strong className="text-[#172525]">+91 {state.mobile}</strong>.{' '}
          <button
            onClick={() => {
              dispatch(actions.setStep('mobile'));
              dispatch(actions.setMsg(null));
            }}
            className="text-[#035352] font-extrabold hover:underline"
          >
            (Change)
          </button>
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider text-center">
          Invitation Code *
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. INV-7K4P9X"
          className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl outline-none text-center text-lg font-mono font-extrabold text-[#035352] placeholder-slate-300 tracking-wider focus:border-[#035352] focus:ring-2 focus:ring-[#035352]/20 transition-all shadow-sm uppercase"
          autoFocus
        />
        <p className="text-center text-[11px] text-slate-400">
          Enter the code provided by your host (e.g. via WhatsApp or SMS)
        </p>
      </div>

      <button
        onClick={handleValidate}
        disabled={validating || !cleanCode}
        className="w-full py-3.5 rounded-full font-bold text-white bg-[#035352] hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-wider cursor-pointer"
      >
        <span>{validating ? 'Verifying Code...' : 'Verify Invitation Code'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Alternative fallback */}
      <div className="pt-2 border-t border-slate-100 text-center space-y-2">
        <button
          type="button"
          onClick={handleFallbackToStandardOtp}
          disabled={fallingBackToOtp}
          className="text-xs font-bold text-slate-500 hover:text-[#035352] hover:underline transition-colors cursor-pointer"
        >
          {fallingBackToOtp ? 'Sending OTP...' : "Don't have a code? Verify via SMS OTP instead"}
        </button>
      </div>

      <div className="text-center text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#035352]" />
        <span>Verified pre-approved fast track check-in</span>
      </div>
    </div>
  );
}
