import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';
import { organisationApi } from '@/api/services';
import { Users, Target, FileText, ChevronDown, UserCheck } from 'lucide-react';

interface Host {
  id: number;
  full_name: string;
  designation: string;
  is_available?: boolean;
  is_available_toggle?: boolean;
  is_date_unavailable?: boolean;
  unavailable_dates?: string[];
}

export default function VisitTab() {
  const { orgId } = useParams();
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.visitor);
  const [hosts, setHosts] = useState<Host[]>([]);

  useEffect(() => {
    organisationApi.getById(parseInt(orgId!)).then((res) => {
      if (res.data.success) setHosts(res.data.data.people || []);
    });
  }, [orgId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(actions.setForm({ [e.target.name]: e.target.value }));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-[#035352]/10 text-[#035352] flex items-center justify-center font-bold">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-[#172525]">
            Visit Details & Host Selection
          </h3>
          <p className="text-[11px] font-medium text-slate-500">Select the host person and state your visit purpose</p>
        </div>
      </div>

      <div className="space-y-4 pt-1">
        {/* Select Host */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Host Person *
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <UserCheck className="w-4 h-4" />
            </div>
            <select
              value={state.hostId}
              onChange={(e) => dispatch(actions.setHostId(e.target.value))}
              className={`w-full pl-10 pr-10 py-2.5 bg-white border rounded-xl outline-none text-xs font-bold text-slate-800 appearance-none transition-all shadow-sm ${
                state.errors.host 
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
                  : 'border-slate-300 focus:border-[#035352] focus:ring-2 focus:ring-[#035352]/20'
              }`}
            >
              <option value="">Choose a host from staff directory</option>
              {hosts.map((h) => {
                const dates = Array.isArray(h.unavailable_dates) ? h.unavailable_dates : [];
                const isDateOff = dates.includes(todayStr) || h.is_date_unavailable === true;
                const toggleAvailable = h.is_available_toggle ?? h.is_available ?? true;
                
                let statusLabel = '🟢 Available';
                if (!toggleAvailable) {
                  statusLabel = '🔴 Unavailable';
                } else if (isDateOff) {
                  statusLabel = '🔴 Unavailable (On Leave Today)';
                }

                return (
                  <option key={h.id} value={h.id}>
                    {h.full_name} {h.designation ? `- ${h.designation}` : ''} ({statusLabel})
                  </option>
                );
              })}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          {state.errors.host && (
            <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
              <span>⚠️</span>
              <span>{state.errors.host}</span>
            </p>
          )}
        </div>

        {/* Purpose of Visit */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Purpose of Visit *
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
              <Target className="w-4 h-4" />
            </div>
            <textarea
              name="purpose_of_visit"
              value={state.form.purpose_of_visit || ''}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the main purpose of your visit (e.g. Official Meeting, Interview, Delivery)"
              className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl outline-none text-xs font-bold text-slate-800 placeholder-slate-400 transition-all shadow-sm resize-none ${
                state.errors.purpose_of_visit 
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
                  : 'border-slate-300 focus:border-[#035352] focus:ring-2 focus:ring-[#035352]/20'
              }`}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] font-semibold text-slate-400">
            {state.errors.purpose_of_visit ? (
              <span className="text-rose-600 font-bold">⚠️ {state.errors.purpose_of_visit}</span>
            ) : (
              <span>Provide clear reason for check-in approval</span>
            )}
            <span className={(state.form.purpose_of_visit?.length || 0) >= 15 ? 'text-[#035352] font-bold' : ''}>
              {state.form.purpose_of_visit?.length || 0}/15 min chars
            </span>
          </div>
        </div>

        {/* Reference */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Reference (Optional)
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <FileText className="w-4 h-4" />
            </div>
            <input
              name="reference"
              value={state.form.reference || ''}
              onChange={handleChange}
              placeholder="e.g. Meeting invite code, PO number, Referred by"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl outline-none text-xs font-bold text-slate-800 placeholder-slate-400 focus:border-[#035352] focus:ring-2 focus:ring-[#035352]/20 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}