import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

export default function ConfirmationScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state: RootState) => state.visitor);

  // Determine if host is available
  const isAvailable = state.confirmData?.host_available !== false;

  const handleRegisterAnother = () => {
    dispatch(actions.reset());
    navigate('/visitor/form/1');
  };

  return (
    <div 
      className="rounded-2xl p-8 text-center"
      style={{
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #021767',
        boxShadow: '0 20px 60px rgba(2, 29, 91, 0.25)'
      }}
    >
      {/* Status Icon */}
      <div className="flex justify-center mb-4">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isAvailable ? '#dcfce7' : '#fef3c7'
          }}
        >
          {isAvailable ? (
            <CheckCircle size={40} style={{ color: '#15803d' }} />
          ) : (
            <XCircle size={40} style={{ color: '#c2410c' }} />
          )}
        </div>
      </div>

      {/* Title */}
      {isAvailable ? (
        <>
          <h2 className="text-2xl font-bold" style={{ color: '#15803d' }}>
            Thank you for visiting!
          </h2>
          <p className="text-lg font-semibold mt-1" style={{ color: '#334155' }}>
            {state.confirmData?.host_name || 'Host'} will be with you shortly.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold" style={{ color: '#c2410c' }}>
            Thank you for your interest.
          </h2>
          <p className="text-lg font-semibold mt-1" style={{ color: '#475569' }}>
            {state.confirmData?.host_name || 'Host'} is currently unavailable.
          </p>
        </>
      )}

      {/* Unavailable Message */}
      {!isAvailable && (
        <div 
          className="mt-4 p-4 rounded-xl text-left"
          style={{
            backgroundColor: '#fef3c7',
            border: '1px solid #fcd34d',
            color: '#92400e'
          }}
        >
          <p className="text-sm font-medium">
            {state.confirmData?.unavailable_message || 'Kindly visit again during scheduled hours.'}
          </p>
        </div>
      )}

      {/* Visit Details Card */}
      <div 
        className="mt-6 p-4 rounded-xl"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #021767'
        }}
      >
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p className="text-xs font-semibold" style={{ color: '#3F5885' }}>
              Check-in Time
            </p>
            <p className="text-sm font-bold mt-0.5" style={{ color: '#3F5885' }}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold" style={{ color: '#3F5885' }}>
              Host Selected
            </p>
            <p className="text-sm font-bold mt-0.5" style={{ color: '#3F5885' }}>
              {state.confirmData?.host_name || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Visitor Details */}
      <div className="mt-4 text-left space-y-1.5 p-3 rounded-lg" style={{ backgroundColor: '#f8fafc' }}>
        <p className="text-xs" style={{ color: '#64748b' }}>
          <span className="font-semibold" style={{ color: '#3F5885' }}>Visitor:</span> {state.form.full_name || 'N/A'}
        </p>
        <p className="text-xs" style={{ color: '#64748b' }}>
          <span className="font-semibold" style={{ color: '#3F5885' }}>Company:</span> {state.form.company || 'N/A'}
        </p>
        <p className="text-xs" style={{ color: '#64748b' }}>
          <span className="font-semibold" style={{ color: '#3F5885' }}>Purpose:</span> {state.form.purpose_of_visit || 'N/A'}
        </p>
      </div>

      {/* Register Another Button */}
      <button
        onClick={handleRegisterAnother}
        className="w-full mt-6 py-3 rounded-xl font-bold text-white transition-all"
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
        Check-In Another Visitor
      </button>
    </div>
  );
}