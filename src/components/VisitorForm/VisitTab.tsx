import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';
import { organisationApi } from '@/api/services';
import { Users, Target, FileText, ChevronDown } from 'lucide-react';

interface Host {
  id: number;
  full_name: string;
  designation: string;
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

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#eff6ff' }}
        >
          <Users size={18} style={{ color: '#2563eb' }} />
        </div>
        <h3 className="font-bold text-lg" style={{ color: '#0f172a' }}>
          Visit Information
        </h3>
      </div>

      {/* Select Host */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#3F5885' }}>
          Select Host *
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Users size={18} style={{ color: '#64748b' }} />
          </div>
          <select
            value={state.hostId}
            onChange={(e) => dispatch(actions.setHostId(e.target.value))}
            className={`w-full pl-10 pr-10 py-3 border rounded-xl outline-none appearance-none transition-all ${
              state.errors.host ? 'border-red-500' : ''
            }`}
            style={{
              borderColor: state.errors.host ? '#ef4444' : '#021767',
              color: '#3F5885',
              fontWeight: 500,
              fontSize: '0.95rem',
              backgroundColor: '#ffffff'
            }}
            onFocus={(e) => {
              if (!state.errors.host) {
                e.target.style.borderColor = '#289CD8';
                e.target.style.boxShadow = '0 0 0 3px rgba(40, 156, 216, 0.2)';
              }
            }}
            onBlur={(e) => {
              if (!state.errors.host) {
                e.target.style.borderColor = '#021767';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            <option value="" style={{ color: '#94a3b8' }}>Select a host</option>
            {hosts.map((h) => (
              <option key={h.id} value={h.id} style={{ color: '#3F5885' }}>
                {h.full_name} - {h.designation}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown size={18} style={{ color: '#64748b' }} />
          </div>
        </div>
        {state.errors.host && (
          <p className="text-sm mt-1" style={{ color: '#ef4444' }}>
            {state.errors.host}
          </p>
        )}
      </div>

      {/* Purpose of Visit */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#3F5885' }}>
          Purpose of Visit *
        </label>
        <div className="relative">
          <div className="absolute left-3 top-3">
            <Target size={18} style={{ color: '#64748b' }} />
          </div>
          <textarea
            name="purpose_of_visit"
            value={state.form.purpose_of_visit || ''}
            onChange={handleChange}
            rows={3}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all resize-none ${
              state.errors.purpose_of_visit ? 'border-red-500' : ''
            }`}
            style={{
              borderColor: state.errors.purpose_of_visit ? '#ef4444' : '#021767',
              color: '#3F5885',
              fontWeight: 500,
              fontSize: '0.95rem',
              backgroundColor: '#ffffff',
              minHeight: '80px'
            }}
            placeholder="Briefly describe the purpose of your visit (min 15 characters)"
            onFocus={(e) => {
              if (!state.errors.purpose_of_visit) {
                e.target.style.borderColor = '#289CD8';
                e.target.style.boxShadow = '0 0 0 3px rgba(40, 156, 216, 0.2)';
              }
            }}
            onBlur={(e) => {
              if (!state.errors.purpose_of_visit) {
                e.target.style.borderColor = '#021767';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
        </div>
        {state.errors.purpose_of_visit && (
          <p className="text-sm mt-1" style={{ color: '#ef4444' }}>
            {state.errors.purpose_of_visit}
          </p>
        )}
        <div className="mt-1 text-xs" style={{ color: '#64748b' }}>
          {state.form.purpose_of_visit?.length || 0}/15 characters minimum
        </div>
      </div>

      {/* Reference */}
      <div>
        <label className="block text-sm font-semibold mb-1.5" style={{ color: '#3F5885' }}>
          Reference (if any)
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <FileText size={18} style={{ color: '#64748b' }} />
          </div>
          <input
            name="reference"
            value={state.form.reference || ''}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all"
            style={{
              borderColor: '#021767',
              color: '#3F5885',
              fontWeight: 500,
              fontSize: '0.95rem',
              backgroundColor: '#ffffff'
            }}
            placeholder="Enter reference (optional)"
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
      </div>
    </div>
  );
}