import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Clock, User, Building, Target, RefreshCw } from 'lucide-react';

export default function ConfirmationScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state: RootState) => state.visitor);

  // Determine if host is available
  const isAvailable = state.confirmData?.host_available !== false;

  const handleRegisterAnother = () => {
    dispatch(actions.reset());
    navigate('/');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xl shadow-[#035352]/10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Status Header Badge */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
          isAvailable ? 'bg-emerald-100 text-emerald-700 shadow-emerald-200' : 'bg-amber-100 text-amber-800 shadow-amber-200'
        }`}>
          {isAvailable ? (
            <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
          ) : (
            <AlertTriangle className="w-10 h-10 stroke-[2.2]" />
          )}
        </div>

        <div>
          {isAvailable ? (
            <>
              <h2 className="text-xl font-black text-emerald-800">
                Check-In Registered!
              </h2>
              <p className="text-xs font-bold text-slate-700 mt-1">
                {state.confirmData?.host_name || 'Host'} has been notified of your arrival.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-black text-amber-800">
                Notice: Host Unavailable
              </h2>
              <p className="text-xs font-bold text-slate-700 mt-1">
                {state.confirmData?.host_name || 'Host'} is currently not available.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Unavailable Info Box */}
      {!isAvailable && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold text-left shadow-sm">
          <p>{state.confirmData?.unavailable_message || 'Thank you for visiting! Host is currently unavailable. Kindly visit again during available hours.'}</p>
        </div>
      )}

      {/* Gate Pass Ticket Card */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 text-left space-y-3 shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <span className="text-[11px] font-extrabold text-[#035352] uppercase tracking-wider">
            Visitor Gate Entry Pass
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
            {isAvailable ? 'PASSED' : 'NOTIFIED'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Visitor Name</span>
            <span className="font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
              <User className="w-3.5 h-3.5 text-[#035352]" />
              <span className="truncate">{state.form.full_name || 'N/A'}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Check-In Time</span>
            <span className="font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-[#035352]" />
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company</span>
            <span className="font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
              <Building className="w-3.5 h-3.5 text-[#035352]" />
              <span className="truncate">{state.form.company || 'N/A'}</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Host Staff</span>
            <span className="font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
              <Target className="w-3.5 h-3.5 text-[#035352]" />
              <span className="truncate">{state.confirmData?.host_name || 'N/A'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleRegisterAnother}
        className="w-full py-3.5 rounded-2xl font-bold text-white bg-[#035352] hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Return to Kiosk / Check-In Another Visitor</span>
      </button>
    </div>
  );
}