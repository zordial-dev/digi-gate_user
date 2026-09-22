import { useState, type ChangeEvent, type FormEvent } from "react";
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[1.75rem] border-[#DCE6F7] p-0 shadow-2xl shadow-[#06216B]/20 sm:rounded-[2rem]" data-testid="register-business-modal">
        {/* Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#061A54] via-[#0A2779] to-[#153D9F] px-6 py-7 text-white sm:px-8 sm:py-8">
          <div className="absolute -right-10 -top-14 size-44 rounded-full bg-[#38BDF8]/20 blur-3xl" />
          <div className="relative z-10">
            <Badge className="border-white/20 bg-white/10 text-[#A8E9FF]" data-testid="register-modal-badge">
              <Sparkles className="mr-1 size-3.5" /> Digi-Gate Business Portal
            </Badge>
            <DialogHeader className="mt-3 text-left">
              <DialogTitle className="font-heading text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl" data-testid="register-modal-title">
                Register Your Organisation
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-blue-100/80" data-testid="register-modal-description">
                Join Digi-Gate to modernize your workplace visitor management experience.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {successData ? (
            <div className="py-4 text-center space-y-5" data-testid="register-success-view">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#EAFBF5] text-[#14845D] ring-8 ring-[#EAFBF5]/50">
                <CheckCircle2 className="size-10" />
              </div>

              <div>
                <h3 className="font-heading text-2xl font-bold text-[#06216B]">
                  Registration Submitted!
                </h3>
                <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for registering <span className="font-bold text-[#06216B]">{successData.name}</span>. Your registration details have been recorded successfully.
                </p>
              </div>

              {/* Status Info Box */}
              <div className="rounded-2xl border border-[#DCE6F7] bg-[#F8FAFC] p-5 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Registration Status</span>
                  <Badge className="border-amber-200 bg-amber-50 text-amber-700 font-bold flex items-center gap-1">
                    <Clock className="size-3" /> Pending Approval
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 space-y-1.5">
                  <p><span className="font-medium text-slate-700">Organisation Reference:</span> #{successData.id}</p>
                  <p className="text-slate-600">Your registration is currently under review. Once approved by an administrator, your organisation access and login credentials will be activated.</p>
                </div>
              </div>

              <div className="pt-3">
                <Button
                  onClick={handleClose}
                  className="w-full h-12 rounded-xl bg-[#06216B] text-white font-bold hover:bg-[#153D9F] transition-colors"
                  data-testid="register-success-close-btn"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="register-business-form">
              {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                  <AlertCircle className="size-5 shrink-0 text-red-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* General Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E8EEF7] pb-2 text-sm font-bold text-[#06216B]">
                  <Building2 className="size-4 text-[#153D9F]" />
                  <span>Organisation Details</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#06216B] mb-1.5">
                    Organisation Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Corporation Pvt Ltd"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-[#DCE6F7] bg-[#F8FAFC] text-sm text-[#0F172A] focus:bg-white focus:border-[#153D9F] focus:outline-none focus:ring-2 focus:ring-[#153D9F]/20 transition-all"
                    data-testid="input-org-name"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[#06216B] mb-1.5 flex items-center gap-1">
                      <Phone className="size-3.5 text-slate-400" /> Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full h-11 px-3.5 rounded-xl border border-[#DCE6F7] bg-[#F8FAFC] text-sm text-[#0F172A] focus:bg-white focus:border-[#153D9F] focus:outline-none focus:ring-2 focus:ring-[#153D9F]/20 transition-all"
                      data-testid="input-org-phone"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#06216B] mb-1.5 flex items-center gap-1">
                      <Globe className="size-3.5 text-slate-400" /> Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://www.example.com"
                      className="w-full h-11 px-3.5 rounded-xl border border-[#DCE6F7] bg-[#F8FAFC] text-sm text-[#0F172A] focus:bg-white focus:border-[#153D9F] focus:outline-none focus:ring-2 focus:ring-[#153D9F]/20 transition-all"
                      data-testid="input-org-website"
                    />
                  </div>
                </div>
              </div>

              {/* Address Details Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E8EEF7] pb-2 text-sm font-bold text-[#06216B]">
                  <MapPin className="size-4 text-[#153D9F]" />
                  <span>Location & Address</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#06216B] mb-1.5">
                    Street Address
                  </label>
                  <textarea
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Suite 404, Tech Park Towers, Silicon Valley Road"
                    className="w-full p-3 rounded-xl border border-[#DCE6F7] bg-[#F8FAFC] text-sm text-[#0F172A] focus:bg-white focus:border-[#153D9F] focus:outline-none focus:ring-2 focus:ring-[#153D9F]/20 transition-all resize-none"
                    data-testid="input-org-address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <label className="block text-xs font-bold text-[#06216B] mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      className="w-full h-11 px-3 rounded-xl border border-[#DCE6F7] bg-[#F8FAFC] text-sm text-[#0F172A] focus:bg-white focus:border-[#153D9F] focus:outline-none focus:ring-2 focus:ring-[#153D9F]/20 transition-all"
                      data-testid="input-org-city"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#06216B] mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                      className="w-full h-11 px-3 rounded-xl border border-[#DCE6F7] bg-[#F8FAFC] text-sm text-[#0F172A] focus:bg-white focus:border-[#153D9F] focus:outline-none focus:ring-2 focus:ring-[#153D9F]/20 transition-all"
                      data-testid="input-org-state"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#06216B] mb-1.5">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      className="w-full h-11 px-3 rounded-xl border border-[#DCE6F7] bg-[#F8FAFC] text-sm text-[#0F172A] focus:bg-white focus:border-[#153D9F] focus:outline-none focus:ring-2 focus:ring-[#153D9F]/20 transition-all"
                      data-testid="input-org-pincode"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#06216B] mb-1.5">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="India"
                      className="w-full h-11 px-3 rounded-xl border border-[#DCE6F7] bg-[#F8FAFC] text-sm text-[#0F172A] focus:bg-white focus:border-[#153D9F] focus:outline-none focus:ring-2 focus:ring-[#153D9F]/20 transition-all"
                      data-testid="input-org-country"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-[#E8EEF7] pb-2 text-sm font-bold text-[#06216B]">
                  <Upload className="size-4 text-[#153D9F]" />
                  <span>Logo & System Preferences</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[#06216B] mb-1.5">Organisation Logo</label>
                    {logoPreview ? (
                      <div className="relative flex items-center justify-between rounded-xl border border-[#DCE6F7] bg-[#F8FAFC] p-2.5">
                        <img src={logoPreview} alt="Logo preview" className="size-10 object-contain rounded-lg border border-slate-200 bg-white" />
                        <span className="text-xs text-slate-600 truncate max-w-[120px]">{logoFile?.name}</span>
                        <button
                          type="button"
                          onClick={removeLogo}
                          className="flex size-7 items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#B6C9E5] bg-[#F8FAFC] text-xs font-semibold text-[#153D9F] hover:bg-[#EAF2FF] transition-all">
                        <Upload className="size-4" />
                        <span>Upload Logo Image</span>
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" data-testid="input-org-logo" />
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#06216B] mb-1.5">Timezone</label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="w-full h-11 px-3 rounded-xl border border-[#DCE6F7] bg-[#F8FAFC] text-sm text-[#0F172A] focus:bg-white focus:border-[#153D9F] focus:outline-none focus:ring-2 focus:ring-[#153D9F]/20 transition-all"
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
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#E8EEF7]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="w-full sm:w-auto h-12 rounded-xl border-[#DCE6F7] text-[#06216B] font-semibold hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#06216B] text-white font-bold hover:bg-[#153D9F] transition-all shadow-lg shadow-[#06216B]/15 flex items-center justify-center gap-2"
                  data-testid="submit-register-business-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4" /> Register Business
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
