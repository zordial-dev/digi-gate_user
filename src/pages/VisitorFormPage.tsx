import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';
import MobileStep from '@/components/VisitorForm/MobileStep';
import OtpStep from '@/components/VisitorForm/OtpStep';
import ConfirmationScreen from '@/components/VisitorForm/ConfirmationScreen';
import PersonalTab from '@/components/VisitorForm/PersonalTab';
import VisitTab from '@/components/VisitorForm/VisitTab';
import SelfieTab from '@/components/VisitorForm/SelfieTab';
import { useParams } from 'react-router-dom';
import { selfieStore } from '@/utils/selfieStore';
import { visitorApi, visitApi, organisationApi } from '@/api/services';

export default function VisitorFormPage() {
  const { orgId } = useParams();
  const state = useSelector((state: RootState) => state.visitor);
  const dispatch = useDispatch();

  // Fetch organisation details when page loads
  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const response = await organisationApi.getById(parseInt(orgId!));
        if (response.data.success) {
          dispatch(actions.setOrg(response.data.data));
        }
      } catch (error) {
        console.error('Failed to fetch organisation:', error);
      }
    };
    if (orgId) fetchOrg();
  }, [orgId, dispatch]);

  const handleSubmit = async () => {
    const selfieFile = selfieStore.file;

    if (!selfieFile) {
      dispatch(actions.setMsg({ type: 'error', text: 'Please capture a selfie' }));
      return;
    }

    dispatch(actions.setLoading(true));
    dispatch(actions.setMsg(null));

    try {
      const formData = new FormData();
      formData.append('organisation_id', orgId!);
      formData.append('host_id', state.hostId);
      formData.append('purpose_of_visit', state.form.purpose_of_visit || '');
      formData.append('reference', state.form.reference || '');
      formData.append('otp_verified', 'true');
      formData.append('selfie', selfieFile);

      if (!state.visitorId) {
        const visitorResponse = await visitorApi.create({
          organisation_id: parseInt(orgId!),
          full_name: state.form.full_name,
          designation: state.form.designation,
          company: state.form.company,
          location: state.form.location || null,
          email: state.form.email || null,
          linkedin: state.form.linkedin || null,
          mobile_number: state.form.mobile_number,
        });

        if (!visitorResponse.data.success) {
          dispatch(actions.setMsg({ type: 'error', text: visitorResponse.data.error || 'Failed to create visitor' }));
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

      if (response.status === 201) {
        dispatch(actions.setConfirmData(result.confirmation));
        dispatch(actions.setShowConfirm(true));
        selfieStore.file = null;
      } else {
        dispatch(actions.setMsg({ type: 'error', text: result.error || 'Registration failed' }));
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      dispatch(actions.setMsg({ type: 'error', text: error.message || 'Network error' }));
    } finally {
      dispatch(actions.setLoading(false));
    }
  };

  // Branding component with curated theme styling
  const Branding = () => {
    if (!state.org) {
      return (
        <div className="text-center mb-6">
          <div className="h-12 w-36 bg-slate-200 animate-pulse rounded-xl mx-auto mb-2"></div>
          <div className="h-6 w-48 bg-slate-200 animate-pulse rounded-lg mx-auto"></div>
        </div>
      );
    }

    let subtitle = '';
    let showWelcomeBack = false;

    if (state.showConfirm) {
      subtitle = 'Visit registered successfully!';
    } else if (state.step === 'mobile') {
      subtitle = 'Enter your mobile number to check in';
    } else if (state.step === 'otp') {
      subtitle = `Enter the code sent to +91 ${state.mobile}`;
    } else if (state.step === 'form') {
      subtitle = 'Complete your profile to check in';
      showWelcomeBack = state.isReturning;
    }

    return (
      <div className="text-center mb-6">
        {state.org.logo_url && (
          <img
            src={state.org.logo_url}
            alt={state.org.name}
            className="h-16 mx-auto mb-3 object-contain rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <h1 className="text-2xl sm:text-3xl font-black text-[#172525] tracking-tight">
          {state.org.name}
        </h1>
        <p className="text-xs sm:text-sm font-bold text-[#035352] mt-1">
          {subtitle}
        </p>
        {showWelcomeBack && (
          <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full font-bold border border-emerald-300">
            Welcome Back!
          </span>
        )}
      </div>
    );
  };

  // RENDER - With curated UI styling
  return (
    <div
      className="min-h-screen py-8 px-4 bg-[#F4F7F6]"
      style={{
        backgroundImage: 'url(/src/assets/visitor_bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Branding - Always visible */}
        <Branding />

        {state.msg && (
          <div
            className={`mb-4 p-3 rounded-xl text-sm font-bold shadow-sm ${
              state.msg.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {state.msg.text}
          </div>
        )}

        {/* Content below branding */}
        {state.showConfirm ? (
          <ConfirmationScreen />
        ) : (
          <>
            {state.step === 'mobile' && <MobileStep />}
            {state.step === 'otp' && <OtpStep />}
            {state.step === 'form' && (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl shadow-[#035352]/10 overflow-hidden">
                <div className="flex border-b border-slate-200">
                  {['Personal', 'Visit', 'Selfie'].map((name, i) => (
                    <button
                      key={i}
                      onClick={() => dispatch(actions.setTab(i))}
                      className={`flex-1 py-4 text-xs sm:text-sm font-bold transition-all ${
                        state.tab === i
                          ? 'bg-[#035352] text-[#F3E8BC] border-b-2 border-[#035352]'
                          : 'text-slate-500 hover:text-[#035352] hover:bg-slate-50'
                      }`}
                    >
                      {i + 1}. {name}
                    </button>
                  ))}
                </div>
                <div className="p-6">
                  {state.tab === 0 && <PersonalTab />}
                  {state.tab === 1 && <VisitTab />}
                  {state.tab === 2 && <SelfieTab />}

                  <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
                    {state.tab > 0 && (
                      <button
                        onClick={() => dispatch(actions.setTab(state.tab - 1))}
                        className="flex-1 py-3 rounded-xl font-bold border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-all text-sm"
                      >
                        Back
                      </button>
                    )}
                    {state.tab < 2 ? (
                      <button
                        onClick={() => dispatch(actions.setTab(state.tab + 1))}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-[#035352] hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 transition-all text-sm"
                      >
                        Next →
                      </button>
                    ) : (
                      state.selfiePreview && (
                        <button
                          onClick={handleSubmit}
                          disabled={state.loading}
                          className="flex-1 py-3 rounded-xl font-bold text-white bg-[#035352] hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 transition-all text-sm disabled:opacity-50"
                        >
                          {state.loading ? 'Submitting...' : 'Complete Registration'}
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
    </div>
  );
}