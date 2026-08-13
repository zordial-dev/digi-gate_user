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
    { name: 'email', label: 'Email', icon: Mail },
    { name: 'linkedin', label: 'LinkedIn', icon: Share2 },
  ];

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#eff6ff' }}
        >
          <User size={18} style={{ color: '#2563eb' }} />
        </div>
        <h3 className="font-bold text-lg" style={{ color: '#0f172a' }}>
          Visitor Information
        </h3>
      </div>

      {fields.map((f) => {
        const Icon = f.icon;
        return (
          <div key={f.name}>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: '#3F5885' }}>
              {f.label}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Icon size={18} style={{ color: '#64748b' }} />
              </div>
              <input
                name={f.name}
                value={state.form[f.name as keyof typeof state.form] || ''}
                onChange={handleChange}
                placeholder={`Enter ${f.label.toLowerCase()}`}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all ${
                  state.errors[f.name] ? 'border-red-500' : ''
                }`}
                style={{
                  borderColor: state.errors[f.name] ? '#ef4444' : '#021767',
                  color: '#3F5885',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  backgroundColor: '#ffffff'
                }}
                onFocus={(e) => {
                  if (!state.errors[f.name]) {
                    e.target.style.borderColor = '#289CD8';
                    e.target.style.boxShadow = '0 0 0 3px rgba(40, 156, 216, 0.2)';
                  }
                }}
                onBlur={(e) => {
                  if (!state.errors[f.name]) {
                    e.target.style.borderColor = '#021767';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
            </div>
            {state.errors[f.name] && (
              <p className="text-sm mt-1" style={{ color: '#ef4444' }}>
                {state.errors[f.name]}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}