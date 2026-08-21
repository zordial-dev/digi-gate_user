import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { actions } from '@/store/slices/visitorSlice';
import { User, Briefcase, Building2, MapPin, Mail, Share2 } from 'lucide-react';

export default function PersonalTab() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.visitor);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(actions.setForm({ [e.target.name]: e.target.value }));
  };

  const fields = [
    { name: 'full_name', label: 'Full Name *', icon: User },
    { name: 'designation', label: 'Designation *', icon: Briefcase },
    { name: 'company', label: 'Company / Association *', icon: Building2 },
    { name: 'location', label: 'Location / City / Branch', icon: MapPin },
    { name: 'email', label: 'Email Address', icon: Mail },
    { name: 'linkedin', label: 'LinkedIn Profile', icon: Share2 },
  ];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-[#035352]/10 text-[#035352] flex items-center justify-center font-bold">
          <User className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-[#172525]">
            Visitor Profile Information
          </h3>
          <p className="text-[11px] font-medium text-slate-500">Provide your personal contact & professional details</p>
        </div>
      </div>

      <div className="space-y-3.5 pt-1">
        {fields.map((f) => {
          const Icon = f.icon;
          const hasError = !!state.errors[f.name];
          return (
            <div key={f.name}>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {f.label}
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Icon className="w-4 h-4" />
                </div>
                <input
                  name={f.name}
                  value={state.form[f.name as keyof typeof state.form] || ''}
                  onChange={handleChange}
                  placeholder={`Enter ${f.label.replace('*', '').trim().toLowerCase()}`}
                  className={`w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl outline-none text-xs font-bold text-slate-800 placeholder-slate-400 transition-all shadow-sm ${
                    hasError 
                      ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
                      : 'border-slate-300 focus:border-[#035352] focus:ring-2 focus:ring-[#035352]/20'
                  }`}
                />
              </div>
              {hasError && (
                <p className="text-[11px] font-bold text-rose-600 mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  <span>{state.errors[f.name]}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}