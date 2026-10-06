import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Globe,
  Upload,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { organisationApi } from "@/api/services";

interface RegisterBusinessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RegisterBusinessModal({ open, onOpenChange }: RegisterBusinessModalProps) {
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
    if (!formData.phone.trim()) {
      setError("Contact phone number is required.");
      return;
    }
    if (!logoFile && !logoPreview) {
      setError("Organisation logo is required.");
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

  const handleClose = () => {
    onOpenChange(false);
    // Reset modal state after closing animation
    setTimeout(() => {
      setFormData({
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
      setLogoFile(null);
      setLogoPreview(null);
      setError(null);
      setSuccessData(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full rounded-[2rem] border border-slate-200/90 bg-white p-0 shadow-2xl shadow-[#035352]/20 overflow-hidden" data-testid="register-business-modal">
        {/* Header Banner */}
        <div className="relative rounded-t-[2rem] overflow-hidden bg-gradient-to-r from-[#023e3d] via-[#035352] to-[#05706f] px-6 py-5 text-white sm:px-8">
          <div className="absolute -right-10 -top-14 size-44 rounded-full bg-[#F3E8BC]/20 blur-3xl pointer-events-none" />
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute right-5 top-5 z-20 flex size-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
          <div className="relative z-10 pr-10">
            <DialogHeader className="mt-0 text-left">
              <DialogTitle className="font-heading text-xl font-bold tracking-tight text-white sm:text-2xl" data-testid="register-modal-title">
                Register Your Organisation
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-xs text-[#F4F7F6]/85" data-testid="register-modal-description">
                Join Digi-Gate to modernize your workplace visitor management experience.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 bg-white rounded-b-[2rem]">
          {successData ? (
            <div className="py-4 text-center space-y-4" data-testid="register-success-view">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-[#10B981] ring-8 ring-emerald-100/60">
                <CheckCircle2 className="size-8" />
              </div>

              <div>
                <h3 className="font-heading text-xl font-bold text-[#035352]">
                  Registration Submitted!
                </h3>
                <p className="mt-1.5 text-xs text-[#4a5d5c] max-w-md mx-auto">
                  Thank you for registering <span className="font-bold text-[#172525]">{successData.name}</span>. Your registration details have been recorded successfully.
                </p>
              </div>

              {/* Status Info Box */}
              <div className="rounded-xl border border-slate-200 bg-[#F4F7F6] p-4 text-left space-y-2.5 max-w-lg mx-auto">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#4a5d5c] uppercase tracking-wider">Registration Status</span>
                  <Badge className="border-amber-200 bg-amber-50 text-amber-800 font-bold flex items-center gap-1 text-[11px] py-0.5 px-2">
                    <Clock className="size-3" /> Pending Approval
                  </Badge>
                </div>
                <div className="text-xs text-[#4a5d5c] space-y-1">
                  <p><span className="font-medium text-[#172525]">Organisation Reference:</span> #{successData.id}</p>
                  <p className="text-[#4a5d5c]">Your registration is currently under review. Once approved by an administrator, your organisation access and login credentials will be activated.</p>
                </div>
              </div>

              <div className="pt-2 max-w-sm mx-auto">
                <Button
                  onClick={handleClose}
                  className="w-full h-10 rounded-full bg-[#035352] text-white text-xs font-bold hover:bg-[#023e3d] transition-colors shadow-md shadow-[#035352]/20 cursor-pointer"
                  data-testid="register-success-close-btn"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" data-testid="register-business-form">
              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                  <AlertCircle className="size-4 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* 2-Column Responsive Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Column 1: Organisation & Identity */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2 border-b border-slate-200/80 pb-1.5 text-xs font-bold uppercase tracking-wider text-[#035352]">
                    <Building2 className="size-3.5 text-[#05706f]" />
                    <span>Organisation Details</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#172525] mb-1">
                      Organisation Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Acme Corporation Pvt Ltd"
                      required
                      className="w-full h-9 px-4 rounded-full border border-slate-200 bg-[#F4F7F6] text-xs text-[#172525] focus:bg-white focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                      data-testid="input-org-name"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#172525] mb-1 flex items-center gap-1">
                        <Phone className="size-3 text-slate-400" /> Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        required
                        className="w-full h-9 px-4 rounded-full border border-slate-200 bg-[#F4F7F6] text-xs text-[#172525] focus:bg-white focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                        data-testid="input-org-phone"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#172525] mb-1 flex items-center gap-1">
                        <Upload className="size-3 text-slate-400" /> Logo <span className="text-red-500">*</span>
                      </label>
                      {logoPreview ? (
                        <div className="relative flex h-9 items-center justify-between rounded-full border border-slate-200 bg-[#F4F7F6] px-3">
                          <img src={logoPreview} alt="Logo" className="size-6 object-contain rounded-full bg-white" />
                          <span className="text-[11px] text-[#4a5d5c] truncate max-w-[80px]">{logoFile?.name}</span>
                          <button
                            type="button"
                            onClick={removeLogo}
                            className="flex size-5 items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors cursor-pointer"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-dashed border-[#035352]/40 bg-[#e6f0f0]/60 text-[11px] font-bold text-[#035352] hover:bg-[#e6f0f0] transition-all">
                          <Upload className="size-3" />
                          <span>Upload Logo</span>
                          <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" data-testid="input-org-logo" />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#172525] mb-1 flex items-center gap-1">
                        <Globe className="size-3 text-slate-400" /> Website (Optional)
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        className="w-full h-9 px-4 rounded-full border border-slate-200 bg-[#F4F7F6] text-xs text-[#172525] focus:bg-white focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                        data-testid="input-org-website"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#172525] mb-1">Timezone</label>
                      <select
                        name="timezone"
                        value={formData.timezone}
                        onChange={handleInputChange}
                        className="w-full h-9 px-3 rounded-full border border-slate-200 bg-[#F4F7F6] text-xs text-[#172525] focus:bg-white focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                        data-testid="select-org-timezone"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (+5:30)</option>
                        <option value="UTC">UTC (GMT)</option>
                        <option value="America/New_York">New York (EST)</option>
                        <option value="Europe/London">London (BST)</option>
                        <option value="Asia/Dubai">Dubai (GST)</option>
                        <option value="Asia/Singapore">Singapore (SGT)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Column 2: Workplace Address */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2 border-b border-slate-200/80 pb-1.5 text-xs font-bold uppercase tracking-wider text-[#035352]">
                    <MapPin className="size-3.5 text-[#05706f]" />
                    <span>Workplace Address</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#172525] mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Suite 404, Tech Park Towers, Silicon Valley Road"
                      className="w-full h-9 px-4 rounded-full border border-slate-200 bg-[#F4F7F6] text-xs text-[#172525] focus:bg-white focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                      data-testid="input-org-address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#172525] mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        className="w-full h-9 px-4 rounded-full border border-slate-200 bg-[#F4F7F6] text-xs text-[#172525] focus:bg-white focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                        data-testid="input-org-city"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#172525] mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Maharashtra"
                        className="w-full h-9 px-4 rounded-full border border-slate-200 bg-[#F4F7F6] text-xs text-[#172525] focus:bg-white focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                        data-testid="input-org-state"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#172525] mb-1">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        className="w-full h-9 px-4 rounded-full border border-slate-200 bg-[#F4F7F6] text-xs text-[#172525] focus:bg-white focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                        data-testid="input-org-pincode"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#172525] mb-1">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="India"
                        className="w-full h-9 px-4 rounded-full border border-slate-200 bg-[#F4F7F6] text-xs text-[#172525] focus:bg-white focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                        data-testid="input-org-country"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Action Bar */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200/80">
                <p className="text-[11px] text-[#718786]">
                  By submitting, you agree to Digi-Gate's workplace terms & privacy policy.
                </p>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={loading}
                    className="w-full sm:w-auto h-9 px-5 rounded-full border border-slate-300 text-xs font-semibold text-[#172525] hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto h-9 px-6 rounded-full bg-[#035352] text-xs font-bold text-white hover:bg-[#023e3d] transition-all shadow-md shadow-[#035352]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                    data-testid="submit-register-business-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="size-3.5" /> Register Business
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
