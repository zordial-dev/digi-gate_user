import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Phone,
  Globe,
  Upload,
  X,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertCircle,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { organisationApi } from "@/api/services";

export default function RegisterBusinessPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    timezone: "Asia/Kolkata",
    host_available_message: "Thank you for visiting! {visitor_name}, {host_name} will be with you shortly.",
    host_unavailable_message: "Thank you for visiting! {visitor_name}, {host_name} is currently unavailable.",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Organisation name is required.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      if (formData.phone.trim()) data.append("phone", formData.phone.trim());
      if (formData.website.trim()) data.append("website", formData.website.trim());
      if (formData.address.trim()) data.append("address", formData.address.trim());
      if (formData.city.trim()) data.append("city", formData.city.trim());
      if (formData.state.trim()) data.append("state", formData.state.trim());
      if (formData.country.trim()) data.append("country", formData.country.trim());
      if (formData.pincode.trim()) data.append("pincode", formData.pincode.trim());
      if (formData.timezone.trim()) data.append("timezone", formData.timezone.trim());
      if (formData.host_available_message.trim()) data.append("host_available_message", formData.host_available_message.trim());
      if (formData.host_unavailable_message.trim()) data.append("host_unavailable_message", formData.host_unavailable_message.trim());

      if (logoFile) {
        data.append("logo", logoFile);
      }

      const res = await organisationApi.register(data);
      if (res.data && res.data.success) {
        setSuccessData(res.data.data);
      } else {
        setError(res.data?.error || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response?.data?.error || err.message || "Failed to register business.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] text-[#172525] flex flex-col justify-between" data-testid="register-business-page">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Digi-Gate Home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#035352] text-[#F3E8BC] font-heading font-extrabold text-lg shadow-sm">
              DG
            </span>
            <span className="font-heading text-xl font-extrabold tracking-tight text-[#035352]">
              Digi<span className="text-[#05706f]">-Gate</span>
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#035352] hover:bg-[#e6f0f0] transition-colors shadow-sm"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Form Page Flow (No grids, natural vertical fields on page) */}
      <main className="mx-auto max-w-2xl w-full px-4 py-10 sm:py-14 sm:px-6">
        {successData ? (
          <div className="py-8 text-center space-y-6" data-testid="register-success-view">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50 text-[#10B981] ring-8 ring-emerald-100/60">
              <CheckCircle2 className="size-12" />
            </div>

            <div>
              <h1 className="font-heading text-3xl font-extrabold text-[#035352]">
                Registration Submitted!
              </h1>
              <p className="mt-3 text-base text-[#4a5d5c] max-w-md mx-auto leading-relaxed">
                Thank you for registering <span className="font-bold text-[#172525]">{successData.name}</span>. Your organisation details have been recorded.
              </p>
            </div>

            {/* Status Box */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-left space-y-3 shadow-sm max-w-lg mx-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#4a5d5c] uppercase tracking-wider">Registration Status</span>
                <Badge className="border-amber-200 bg-amber-50 text-amber-800 font-bold flex items-center gap-1.5 px-3 py-1 rounded-full text-xs">
                  <Clock className="size-3.5" /> Pending Approval
                </Badge>
              </div>
              <div className="text-xs text-[#4a5d5c] space-y-2 pt-1">
                <p>
                  <span className="font-semibold text-[#172525]">Reference ID:</span> #{successData.id}
                </p>
                <p className="leading-relaxed">
                  Your request is being verified by the Digi-Gate administrator. Once approved, your master dashboard login credentials will be activated.
                </p>
              </div>
            </div>

            <div className="pt-4 max-w-xs mx-auto">
              <Button
                onClick={() => navigate("/")}
                className="w-full h-12 rounded-full bg-[#035352] text-white text-sm font-bold hover:bg-[#023e3d] transition-all shadow-md shadow-[#035352]/20 cursor-pointer"
                data-testid="register-success-close-btn"
              >
                Return to Home
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8" data-testid="register-business-form-card">
            {/* Page Header */}
            <div>
              <Badge className="border-[#035352]/20 bg-[#035352]/10 text-[#035352] text-xs font-bold py-1 px-3.5 rounded-full" data-testid="register-page-badge">
                <Sparkles className="mr-1.5 size-3.5 text-[#05706f]" /> Organisation Onboarding
              </Badge>
              <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#172525]" data-testid="register-page-title">
                Register Your Organisation
              </h1>
              <p className="mt-2 text-sm sm:text-base text-[#4a5d5c] leading-relaxed" data-testid="register-page-description">
                Enter your organisation details below to set up digital visitor check-ins, security logs, and instant host notifications.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8" data-testid="register-business-form">
              {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                  <AlertCircle className="size-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Section 1: Organisation Details */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-bold text-[#035352]">
                  <Building2 className="size-4 text-[#05706f]" />
                  <span>Organisation Information</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172525] mb-1.5">
                    Organisation Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Corporation Pvt Ltd"
                    required
                    className="w-full h-11 px-5 rounded-full border border-slate-200 bg-white text-sm text-[#172525] shadow-sm focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                    data-testid="input-org-name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172525] mb-1.5 flex items-center gap-1">
                    <Phone className="size-3.5 text-slate-400" /> Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full h-11 px-5 rounded-full border border-slate-200 bg-white text-sm text-[#172525] shadow-sm focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                    data-testid="input-org-phone"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172525] mb-1.5 flex items-center gap-1">
                    <Globe className="size-3.5 text-slate-400" /> Website URL
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.example.com"
                    className="w-full h-11 px-5 rounded-full border border-slate-200 bg-white text-sm text-[#172525] shadow-sm focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                    data-testid="input-org-website"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172525] mb-1.5 flex items-center gap-1">
                    <Upload className="size-3.5 text-slate-400" /> Organisation Logo
                  </label>
                  {logoPreview ? (
                    <div className="flex h-12 items-center justify-between rounded-full border border-slate-200 bg-white px-4 shadow-sm">
                      <div className="flex items-center gap-3 truncate">
                        <img src={logoPreview} alt="Logo" className="size-8 object-contain rounded-full bg-slate-50 border border-slate-100" />
                        <span className="text-xs text-[#4a5d5c] truncate">{logoFile?.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="flex size-7 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors cursor-pointer shrink-0"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-dashed border-[#035352]/40 bg-white px-5 text-xs font-bold text-[#035352] hover:bg-[#e6f0f0] transition-all shadow-sm">
                      <Upload className="size-4 text-[#05706f]" />
                      <span>Upload Logo Image</span>
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" data-testid="input-org-logo" />
                    </label>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172525] mb-1.5">System Timezone</label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="w-full h-11 px-5 rounded-full border border-slate-200 bg-white text-sm text-[#172525] shadow-sm focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                    data-testid="select-org-timezone"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                  </select>
                </div>
              </div>

              {/* Section 2: Workplace Address */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-bold text-[#035352]">
                  <MapPin className="size-4 text-[#05706f]" />
                  <span>Workplace Address</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172525] mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Suite 404, Tech Park Towers, Silicon Valley Road"
                    className="w-full h-11 px-5 rounded-full border border-slate-200 bg-white text-sm text-[#172525] shadow-sm focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                    data-testid="input-org-address"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172525] mb-1.5">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Mumbai"
                    className="w-full h-11 px-5 rounded-full border border-slate-200 bg-white text-sm text-[#172525] shadow-sm focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                    data-testid="input-org-city"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172525] mb-1.5">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Maharashtra"
                    className="w-full h-11 px-5 rounded-full border border-slate-200 bg-white text-sm text-[#172525] shadow-sm focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                    data-testid="input-org-state"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172525] mb-1.5">Pincode / Postal Code</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="400001"
                    className="w-full h-11 px-5 rounded-full border border-slate-200 bg-white text-sm text-[#172525] shadow-sm focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                    data-testid="input-org-pincode"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#172525] mb-1.5">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="India"
                    className="w-full h-11 px-5 rounded-full border border-slate-200 bg-white text-sm text-[#172525] shadow-sm focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                    data-testid="input-org-country"
                  />
                </div>
              </div>

              {/* Submit Buttons & Trust line */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:flex-1 h-12 rounded-full bg-[#035352] text-sm font-bold text-white hover:bg-[#023e3d] transition-all shadow-lg shadow-[#035352]/20 flex items-center justify-center gap-2 cursor-pointer"
                    data-testid="submit-register-business-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" /> Submitting Registration...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="size-4" /> Register Business
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                    disabled={loading}
                    className="w-full sm:w-auto h-12 px-8 rounded-full border border-slate-300 text-xs font-semibold text-[#172525] hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-5 text-xs text-[#718786] pt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="size-3.5 text-emerald-600" /> 256-bit Encrypted
                  </span>
                  <span className="size-1 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-1.5 font-medium">
                    <Zap className="size-3.5 text-amber-500" /> Fast Setup
                  </span>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#718786]">
          <p>&copy; {new Date().getFullYear()} Digi-Gate. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[10px] tracking-wider uppercase">Enterprise Workplace Visitor Portal</p>
        </div>
      </footer>
    </div>
  );
}
