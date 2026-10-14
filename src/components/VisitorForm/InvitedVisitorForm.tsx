import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';
import { visitApi, visitorApi } from '@/api/services';
import { selfieStore } from '@/utils/selfieStore';
import SelfieTab from './SelfieTab';
import { 
  Lock, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, ShieldCheck 
} from 'lucide-react';

export default function InvitedVisitorForm() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.visitor);
  const inv = state.invitationData;

  const [subStep, setSubStep] = useState<'details' | 'selfie'>('details');
  const [notes, setNotes] = useState(state.invitationNotes || inv?.additional_notes || '');
  const [submitting, setSubmitting] = useState(false);

  const hostName = inv?.host_name || 'Assigned Host';
  const hostDept = inv?.host_department || '';
  const hostPic = inv?.host_profile_pic || null;

  const handleConfirmDetails = () => {
    dispatch(actions.setInvitationNotes(notes));
    dispatch(actions.setMsg(null));
    setSubStep('selfie');
  };

  const handleSubmit = async () => {
    const selfieFile = selfieStore.file;
    if (!selfieFile) {
      dispatch(actions.setMsg({ type: 'error', text: 'Please capture your selfie photo to complete check-in' }));
      return;
    }

    if (!state.org) {
      dispatch(actions.setMsg({ type: 'error', text: 'Organisation information missing' }));
      return;
    }

    setSubmitting(true);
    dispatch(actions.setMsg(null));

    try {
      const activeOrgId = state.org.id;
      let visitorIdToUse = state.visitorId || inv?.visitor_id;

      // Ensure visitor record exists
      if (!visitorIdToUse) {
        const createVisRes = await visitorApi.create({
          organisation_id: activeOrgId,
          full_name: inv?.visitor_name || state.form.full_name,
          mobile_number: inv?.mobile_number || state.mobile,
          designation: 'Invited Guest',
          company: 'Guest',
        });
        if (createVisRes.data.success && createVisRes.data.data) {
          visitorIdToUse = createVisRes.data.data.id;
          dispatch(actions.setVisitorId(visitorIdToUse));
        }
      }

      const formData = new FormData();
      formData.append('organisation_id', String(activeOrgId));
      formData.append('visitor_id', String(visitorIdToUse || '1'));
      formData.append('host_id', String(inv?.host_id || state.hostId));
      formData.append('purpose_of_visit', inv?.purpose_of_visit || state.form.purpose_of_visit || 'Meeting');
      formData.append('reference', notes ? `[Invited: ${state.invitationCode}] ${notes}` : `[Invited: ${state.invitationCode}]`);
      formData.append('invitation_code', state.invitationCode);
      formData.append('otp_verified', 'true');
      formData.append('selfie', selfieFile);

      const response = await visitApi.create(formData);
      const result = response.data;

      if (response.status === 201 || result.success) {
        dispatch(actions.setConfirmData(result.confirmation));
        dispatch(actions.setShowConfirm(true));
        selfieStore.file = null;
      } else {
        dispatch(actions.setMsg({ type: 'error', text: result.error || 'Failed to complete check-in' }));
      }
    } catch (err: any) {
      console.error('Invited check-in error:', err);
      const errMsg = err.response?.data?.error || err.message || 'Check-in submission failed. Please try again.';
      dispatch(actions.setMsg({ type: 'error', text: errMsg }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-[#035352]/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Invitation Header Banner */}
      <div className="bg-slate-50/90 border-b border-slate-100 p-4 sm:p-5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#035352] text-[#F3E8BC] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-[#172525]">Invited Guest Check-In</h3>
              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-teal-100 text-[#035352]">
                {state.invitationCode}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Pre-approved fast track access</p>
          </div>
        </div>

        {/* Sub-step Pill */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSubStep('details')}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              subStep === 'details' ? 'bg-[#035352] text-white' : 'text-slate-500'
            }`}
          >
            1. Details
          </button>
          <button
            type="button"
            onClick={() => handleConfirmDetails()}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              subStep === 'selfie' ? 'bg-[#035352] text-white' : 'text-slate-500'
            }`}
          >
            2. Selfie
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {subStep === 'details' ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Guest Name & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Visitor Name
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800">
                  {inv?.visitor_name || state.form.full_name}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Mobile Number</span>
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" /> Locked
                  </span>
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>+91 {inv?.mobile_number || state.mobile}</span>
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Host Details Card (Locked) */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Meeting With (Host)</span>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" /> Pre-Assigned
                </span>
              </label>
              <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {hostPic ? (
                    <img src={hostPic} alt="" className="w-10 h-10 rounded-xl object-cover border border-teal-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[#035352] text-[#F3E8BC] flex items-center justify-center font-black text-sm">
                      {hostName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-black text-[#172525]">{hostName}</p>
                    <p className="text-[11px] text-slate-500 font-semibold">{hostDept || 'Host Person'}</p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-white border border-teal-200/80 text-[10px] font-extrabold text-[#035352] uppercase tracking-wider">
                  Verified Host
                </div>
              </div>
            </div>

            {/* Purpose of Visit (Locked) */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Purpose of Visit</span>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" /> Locked
                </span>
              </label>
              <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>{inv?.purpose_of_visit || state.form.purpose_of_visit}</span>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Additional Notes (Editable) */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Additional Notes / Remarks</span>
                <span className="text-[10px] text-[#035352] font-extrabold uppercase">
                  Editable
                </span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Modify or add additional notes, arrival comments, or messages for the host..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#035352] focus:ring-1 focus:ring-[#035352] outline-none text-xs font-semibold resize-none"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                You may modify or add extra notes before confirming your visit details.
              </p>
            </div>

            {/* Action Button: Confirm Details */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleConfirmDetails}
                className="w-full py-3.5 rounded-full font-bold text-white bg-[#035352] hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <span>Confirm Details & Take Selfie</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Selfie Tab */}
            <SelfieTab />

            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSubStep('details')}
                className="px-5 py-3 rounded-full font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !state.selfiePreview}
                className="flex-1 py-3.5 rounded-full font-bold text-white bg-[#035352] hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Visit Request...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#F3E8BC]" />
                    <span>Submit Visit Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#035352]" />
        <span>Your invitation code will be validated and marked as used upon submission</span>
      </div>
    </div>
  );
}
