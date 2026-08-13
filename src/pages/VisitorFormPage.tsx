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

  // Branding component with Zordial styling
  const Branding = () => {
    if (!state.org) {
      return (
        <div className="text-center mb-6">
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded mx-auto mb-2"></div>
          <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mx-auto"></div>
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
            className="h-16 mx-auto mb-3 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <h1 className="text-2xl font-bold" style={{ color: '#06216B' }}>
          {state.org.name}
        </h1>
        <p className="text-sm mt-1" style={{ color: '#3F5885', fontWeight: 600 }}>
          {subtitle}
        </p>
        {showWelcomeBack && (
          <span className="inline-block mt-2 px-4 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
            Welcome Back!
          </span>
        )}
      </div>
    );
  };

  // RENDER - With Zordial UI styling
  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{
        backgroundColor: '#ffffff',
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
            className={`mb-4 p-3 rounded-lg text-sm font-medium ${state.msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            style={{
              border: state.msg.type === 'success' ? '1px solid #86efac' : '1px solid #fca5a5'
            }}
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
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.96)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid #021767',
                  boxShadow: '0 20px 60px rgba(2, 29, 91, 0.25)'
                }}
              >
                <div className="flex border-b" style={{ borderColor: '#021767' }}>
                  {['Personal', 'Visit', 'Selfie'].map((name, i) => (
                    <button
                      key={i}
                      onClick={() => dispatch(actions.setTab(i))}
                      className={`flex-1 py-4 text-sm font-semibold transition-all ${state.tab === i
                          ? 'border-b-2 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                        }`}
                      style={{
                        borderColor: state.tab === i ? '#153D9F' : 'transparent',
                        color: state.tab === i ? '#153D9F' : '#64748b',
                        fontWeight: state.tab === i ? 800 : 600
                      }}
                    >
                      {i + 1}. {name}
                    </button>
                  ))}
                </div>
                <div className="p-6">
                  {state.tab === 0 && <PersonalTab />}
                  {state.tab === 1 && <VisitTab />}
                  {state.tab === 2 && <SelfieTab />}

                  <div className="flex gap-3 mt-6 pt-6" style={{ borderTop: '1px solid #e2e8f0' }}>
                    {state.tab > 0 && (
                      <button
                        onClick={() => dispatch(actions.setTab(state.tab - 1))}
                        className="flex-1 py-3 rounded-xl font-bold transition-all"
                        style={{
                          border: '1px solid #021767',
                          color: '#3F5885',
                          background: 'transparent'
                        }}
                      >
                        Back
                      </button>
                    )}
                    {state.tab < 2 ? (
                      <button
                        onClick={() => dispatch(actions.setTab(state.tab + 1))}
                        className="flex-1 py-3 rounded-xl font-bold text-white transition-all"
                        style={{
                          background: 'linear-gradient(135deg, #153D9F 0%, #06216B 100%)',
                          boxShadow: '0 6px 18px rgba(2, 29, 91, 0.2)',
                          border: '1px solid #021767'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #06216B 0%, #021D5B 100%)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #153D9F 0%, #06216B 100%)';
                        }}
                      >
                        Next →
                      </button>
                    ) : (
                      state.selfiePreview && (
                        <button
                          onClick={handleSubmit}
                          disabled={state.loading}
                          className="flex-1 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50"
                          style={{
                            background: 'linear-gradient(135deg, #153D9F 0%, #06216B 100%)',
                            boxShadow: '0 6px 18px rgba(2, 29, 91, 0.2)',
                            border: '1px solid #021767'
                          }}
                          onMouseEnter={(e) => {
                            if (!state.loading) {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #06216B 0%, #021D5B 100%)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!state.loading) {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #153D9F 0%, #06216B 100%)';
                            }
                          }}
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