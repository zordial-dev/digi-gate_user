import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';
import MobileStep from '@/components/VisitorForm/MobileStep';
import OtpStep from '@/components/VisitorForm/OtpStep';
import ConfirmationScreen from '@/components/VisitorForm/ConfirmationScreen';
import PersonalTab from '@/components/VisitorForm/PersonalTab';
import VisitTab from '@/components/VisitorForm/VisitTab';
import SelfieTab from '@/components/VisitorForm/SelfieTab';
import { useParams, useNavigate } from 'react-router-dom';
import { selfieStore } from '@/utils/selfieStore';
import { visitorApi, visitApi, organisationApi } from '@/api/services';
import { CheckCircle2, User, Camera, Target, ArrowLeft, ArrowRight, Building2, AlertCircle, QrCode } from 'lucide-react';

export default function VisitorFormPage() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const state = useSelector((state: RootState) => state.visitor);
  const dispatch = useDispatch();

  const [loadingOrg, setLoadingOrg] = useState(true);
  const [orgError, setOrgError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  // Fetch & validate organisation details when page loads
  useEffect(() => {
    const fetchOrg = async () => {
      if (!orgId || orgId.trim() === '') {
        setOrgError('No organisation code or ID provided');
        setLoadingOrg(false);
        return;
      }

      setLoadingOrg(true);
      setOrgError(null);

      try {
        const response = await organisationApi.getById(orgId.trim());
        const result = response.data;

        if (result && result.success && result.data && result.data.id) {
          dispatch(actions.setOrg(result.data));
          setOrgError(null);
        } else {
          dispatch(actions.setOrg(null));
          setOrgError(result?.error || `Organisation "${orgId}" not found or inactive.`);
        }
      } catch (error: any) {
        console.error('Failed to fetch organisation:', error);
        dispatch(actions.setOrg(null));
        const errMsg = error.response?.data?.error || `Invalid Organisation: Could not verify "${orgId}".`;
        setOrgError(errMsg);
      } finally {
        setLoadingOrg(false);
      }
    };

    fetchOrg();
  }, [orgId, dispatch]);

  const handleSubmit = async () => {
    if (!state.org) {
      dispatch(actions.setMsg({ type: 'error', text: 'Invalid organisation. Cannot submit registration.' }));
      return;
    }

    // 1. Validate Selfie
    const selfieFile = selfieStore.file;
    if (!selfieFile) {
      dispatch(actions.setMsg({ type: 'error', text: 'Please capture a selfie photo to complete registration' }));
      return;
    }

    // 2. Validate Host Selection
    if (!state.hostId) {
      dispatch(actions.setMsg({ type: 'error', text: 'Please select a Host person for your visit' }));
      dispatch(actions.setTab(1));
      return;
    }

    // 3. Validate Purpose of Visit
    if (!state.form.purpose_of_visit || state.form.purpose_of_visit.trim().length < 5) {
      dispatch(actions.setMsg({ type: 'error', text: 'Please enter a Purpose of Visit (at least 5 characters)' }));
      dispatch(actions.setTab(1));
      return;
    }

    // 4. Validate Personal Profile Fields
    if (!state.form.full_name?.trim() || !state.form.company?.trim()) {
      dispatch(actions.setMsg({ type: 'error', text: 'Please complete your Full Name and Company details' }));
      dispatch(actions.setTab(0));
      return;
    }

    dispatch(actions.setLoading(true));
    dispatch(actions.setMsg(null));

    try {
      const activeOrgId = state.org.id;

      const formData = new FormData();
      formData.append('organisation_id', activeOrgId.toString());
      formData.append('host_id', state.hostId);
      formData.append('purpose_of_visit', state.form.purpose_of_visit.trim());
      formData.append('reference', state.form.reference || '');
      formData.append('otp_verified', 'true');
      formData.append('selfie', selfieFile);

      if (!state.visitorId) {
        const visitorResponse = await visitorApi.create({
          organisation_id: activeOrgId,
          full_name: state.form.full_name,
          designation: state.form.designation,
          company: state.form.company,
          location: state.form.location || null,
          email: state.form.email || null,
          linkedin: state.form.linkedin || null,
          mobile_number: state.form.mobile_number,
        });

        if (!visitorResponse.data.success) {
          dispatch(actions.setMsg({ type: 'error', text: visitorResponse.data.error || 'Failed to create visitor profile' }));
          dispatch(actions.setLoading(false));
          return;
        }

        formData.append('visitor_id', visitorResponse.data.data.id.toString());
        dispatch(actions.setVisitorId(visitorResponse.data.data.id));
      } else {
        formData.append('visitor_id', state.visitorId.toString());
      }

      const response = await visitApi.create(formData);
      const result = response.data;

      if (response.status === 201 || result.success) {
        dispatch(actions.setConfirmData(result.confirmation));
        dispatch(actions.setShowConfirm(true));
        selfieStore.file = null;
      } else {
        dispatch(actions.setMsg({ type: 'error', text: result.error || 'Registration failed' }));
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      const errorText = error.response?.data?.error || error.message || 'Registration failed due to network error';
      dispatch(actions.setMsg({ type: 'error', text: errorText }));
    } finally {
      dispatch(actions.setLoading(false));
    }
  };

  // 1. Loading State Screen
  if (loadingOrg) {
    return (
      <div className="min-h-screen py-12 px-4 bg-[#F4F7F6] flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-2xl text-center space-y-4 max-w-md w-full animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-2xl bg-[#035352]/10 text-[#035352] flex items-center justify-center mx-auto animate-pulse">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-[#172525]">Verifying Organisation...</h2>
          <p className="text-xs text-slate-500 font-medium">Checking organisation details with Digi-Gate server</p>
        </div>
      </div>
    );
  }

  // 2. Invalid Organisation Screen (Shown BEFORE requesting Mobile Number for OTP)
  if (orgError || !state.org) {
    return (
      <div className="min-h-screen py-12 px-4 bg-[#F4F7F6] flex flex-col items-center justify-center selection:bg-rose-600 selection:text-white">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200/90 shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner border border-rose-200">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 text-[11px] font-extrabold uppercase tracking-wider rounded-full border border-rose-300">
              Invalid Organisation
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Organisation Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              The organisation code or name <span className="font-bold text-slate-900 underline decoration-rose-400 decoration-2">"{orgId}"</span> is invalid, inactive, or not registered in Digi-Gate.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-700">What should I do?</p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500">
              <li>Check for spelling errors in the organisation name or code.</li>
              <li>Scan the official gate QR code provided at the reception desk.</li>
              <li>Contact security or your host for the valid organisation ID.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => navigate('/scan')}
              className="w-full py-3.5 rounded-2xl font-bold text-white bg-[#035352] hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 transition-all text-xs flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan Gate QR Code</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-2xl font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Digi-Gate Home</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-[11px] font-semibold text-slate-400">
          Powered by DIGI-GATE Gate Pass System
        </div>
      </div>
    );
  }

  // 3. Branding subtitle logic (inlined to avoid flicker from inner-component remounting)
  let brandingSubtitle = '';
  let showWelcomeBack = false;
  if (state.showConfirm) {
    brandingSubtitle = 'Visit registered successfully!';
  } else if (state.step === 'mobile') {
    brandingSubtitle = 'Enter your mobile number to check in';
  } else if (state.step === 'otp') {
    brandingSubtitle = `Enter 6-digit OTP code sent to +91 ${state.mobile}`;
  } else if (state.step === 'form') {
    brandingSubtitle = 'Complete your profile to generate gate pass';
    showWelcomeBack = state.isReturning;
  }

  // 4. Main Visitor Check-In Form Screen
  return (
    <div className="min-h-screen py-6 px-4 bg-[#F4F7F6] flex flex-col justify-between selection:bg-[#035352] selection:text-white">
      <div className="max-w-lg mx-auto w-full space-y-5">
        {/* Branding Header */}
        <div className="text-center mb-6 space-y-2">
          {state.org.logo_url && !logoError ? (
            <img
              src={state.org.logo_url}
              alt={state.org.name}
              className="h-14 mx-auto object-contain rounded-xl p-1 bg-white border border-slate-200 shadow-sm"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-[#035352] text-[#F3E8BC] flex items-center justify-center mx-auto shadow-md border border-[#035352]">
              <Building2 className="w-6 h-6" />
            </div>
          )}

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#172525] tracking-tight">
              {state.org.name}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#035352]">
              {brandingSubtitle}
            </p>
          </div>

          {showWelcomeBack && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-bold border border-emerald-300 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Welcome Back! Profile Auto-Filled</span>
            </span>
          )}
        </div>

        {/* Global Notification Banner */}
        {state.msg && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold shadow-sm animate-in fade-in ${
              state.msg.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {state.msg.text}
          </div>
        )}

        {/* Form Container */}
        {state.showConfirm ? (
          <ConfirmationScreen />
        ) : (
          <>
            {state.step === 'mobile' && <MobileStep />}
            {state.step === 'otp' && <OtpStep />}
            {state.step === 'form' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-[#035352]/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* 3-Step Navigation Header */}
                <div className="flex border-b border-slate-100 bg-slate-50/80 p-1.5 gap-1">
                  {[
                    { title: 'Personal', icon: User },
                    { title: 'Visit Details', icon: Target },
                    { title: 'Selfie Photo', icon: Camera }
                  ].map((tab, i) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={i}
                        onClick={() => dispatch(actions.setTab(i))}
                        className={`flex-1 py-3 px-1.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          state.tab === i
                            ? 'bg-[#035352] text-[#F3E8BC] shadow-md shadow-[#035352]/20'
                            : 'text-slate-500 hover:text-[#035352]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden sm:inline">{tab.title}</span>
                        <span className="sm:hidden">{i + 1}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-5 sm:p-7">
                  {state.tab === 0 && <PersonalTab />}
                  {state.tab === 1 && <VisitTab />}
                  {state.tab === 2 && <SelfieTab />}

                  {/* Form Action Controls */}
                  <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
                    {state.tab > 0 && (
                      <button
                        onClick={() => dispatch(actions.setTab(state.tab - 1))}
                        className="flex-1 py-3 rounded-2xl font-bold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                    )}

                    {state.tab < 2 ? (
                      <button
                        onClick={() => dispatch(actions.setTab(state.tab + 1))}
                        className="flex-1 py-3 rounded-2xl font-bold text-white bg-[#035352] hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 transition-all text-xs flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      state.selfiePreview && (
                        <button
                          onClick={handleSubmit}
                          disabled={state.loading}
                          className="flex-1 py-3 rounded-2xl font-bold text-white bg-[#035352] hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 transition-all text-xs disabled:opacity-50 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {state.loading ? 'Submitting Registration...' : 'Complete Check-In Pass'}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="py-3 text-center text-[11px] font-semibold text-slate-400">
        Powered by DIGI-GATE Gate Pass System
      </div>
    </div>
  );
}