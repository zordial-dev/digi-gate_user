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
  ArrowRight,
  Zap,
  Lock,
  Eye,
  EyeOff,
  Mail,
  KeyRound,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { organisationApi } from "@/api/services";

export default function RegisterBusinessPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  // Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // OTP Verification state for Step 3
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Submit and form feedback state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
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

  // Step 1 -> Step 2
  const handleProceedToStep2 = () => {
    setError(null);
    if (!formData.name.trim()) {
      setError("Organisation name is required.");
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2 -> Step 3
  const handleProceedToStep3 = () => {
    setError(null);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 3: Send OTP
  const handleSendOtp = async () => {
    setError(null);
    setOtpMessage(null);

    const cleanEmail = formData.email.trim();
    if (!cleanEmail) {
      setError("Please enter a business email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid business email address.");
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await organisationApi.sendVerificationOtp(cleanEmail);
      if (res.data && res.data.success) {
        setOtpSent(true);
        setOtpMessage(`Verification code sent to ${cleanEmail}. Please check your inbox.`);
      } else {
        setError(res.data?.error || "Mail was not sent.");
        setOtpSent(false);
      }
    } catch (err: any) {
      console.error("Send OTP error:", err);
      const serverError = err.response?.data?.error;
      setError(serverError || "Mail was not sent.");
      setOtpSent(false);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 3: Verify OTP & Advance to Step 4 (Password)
  const handleVerifyOtpAndProceed = async () => {
    setError(null);
    if (!otpCode.trim()) {
      setError("Please enter the verification code sent to your email.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const res = await organisationApi.verifyRegistrationOtp(formData.email.trim(), otpCode.trim());
      if (res.data && res.data.success) {
        setEmailVerified(true);
        setCurrentStep(4);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError(res.data?.error || "Invalid verification code.");
      }
    } catch (err: any) {
      console.error("Verify OTP error:", err);
      setError(err.response?.data?.error || err.message || "Verification code is invalid or expired.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Step 4: Final Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!emailVerified) {
      setError("Please verify your business email before setting passwords.");
      setCurrentStep(3);
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password is required and must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("email", formData.email.trim().toLowerCase());
      data.append("password", formData.password.trim());

      if (formData.phone.trim()) data.append("phone", formData.phone.trim());
      if (formData.website.trim()) data.append("website", formData.website.trim());
      if (formData.address.trim()) data.append("address", formData.address.trim());
      if (formData.city.trim()) data.append("city", formData.city.trim());
      if (formData.state.trim()) data.append("state", formData.state.trim());
      if (formData.country.trim()) data.append("country", formData.country.trim());
      if (formData.pincode.trim()) data.append("pincode", formData.pincode.trim());
      if (formData.timezone.trim()) data.append("timezone", formData.timezone.trim());
      if (formData.host_available_message.trim()) {
        data.append("host_available_message", formData.host_available_message.trim());
      }
      if (formData.host_unavailable_message.trim()) {
        data.append("host_unavailable_message", formData.host_unavailable_message.trim());
      }

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

      {/* Main Flow Container */}
      <main className="mx-auto max-w-2xl w-full px-4 py-10 sm:py-12 sm:px-6">
        {successData ? (
          <div className="py-8 text-center space-y-6 animate-in fade-in duration-300" data-testid="register-success-view">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50 text-[#10B981] ring-8 ring-emerald-100/60">
              <CheckCircle2 className="size-12" />
            </div>

            <div>
              <h1 className="font-heading text-3xl font-extrabold text-[#035352]">
                Registration Submitted!
              </h1>
              <p className="mt-3 text-base text-[#4a5d5c] max-w-md mx-auto leading-relaxed">
                Thank you for registering <span className="font-bold text-[#172525]">{formData.name}</span>. A confirmation notification has been dispatched to <span className="font-semibold text-[#035352]">{formData.email}</span>.
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
                  <span className="font-semibold text-[#172525]">Reference ID:</span> #{successData.id || successData.code || "REG"}
                </p>
                <p>
                  <span className="font-semibold text-[#172525]">Verified Admin Email:</span> {formData.email}
                </p>
                <p className="leading-relaxed">
                  Your request is being reviewed by the Super Administrator. Once approved, you can log in to your master portal with this email and the password you just created.
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
                Follow the 4 steps below to set up digital visitor check-ins, verify your official business email, and configure your master portal password.
              </p>
            </div>

            {/* Step Progress Stepper Bar (4 Steps) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between">
                {/* Step 1 */}
                <div
                  onClick={() => currentStep > 1 && setCurrentStep(1)}
                  className={`flex items-center gap-2 ${currentStep > 1 ? "cursor-pointer" : ""}`}
                >
                  <div
                    className={`flex size-7 sm:size-8 items-center justify-center rounded-full text-xs font-extrabold transition-all ${
                      currentStep === 1
                        ? "bg-[#035352] text-white ring-4 ring-[#035352]/10"
                        : currentStep > 1
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {currentStep > 1 ? "✓" : "1"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 1</p>
                    <p className={`text-xs font-bold ${currentStep === 1 ? "text-[#035352]" : "text-slate-700"}`}>
                      Organisation
                    </p>
                  </div>
                </div>

                <div className={`h-0.5 flex-1 mx-2 sm:mx-3 rounded-full transition-all ${currentStep > 1 ? "bg-emerald-400" : "bg-slate-200"}`} />

                {/* Step 2 */}
                <div
                  onClick={() => currentStep > 2 && setCurrentStep(2)}
                  className={`flex items-center gap-2 ${currentStep > 2 ? "cursor-pointer" : ""}`}
                >
                  <div
                    className={`flex size-7 sm:size-8 items-center justify-center rounded-full text-xs font-extrabold transition-all ${
                      currentStep === 2
                        ? "bg-[#035352] text-white ring-4 ring-[#035352]/10"
                        : currentStep > 2
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {currentStep > 2 ? "✓" : "2"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 2</p>
                    <p className={`text-xs font-bold ${currentStep === 2 ? "text-[#035352]" : "text-slate-700"}`}>
                      Workplace
                    </p>
                  </div>
                </div>

                <div className={`h-0.5 flex-1 mx-2 sm:mx-3 rounded-full transition-all ${currentStep > 2 ? "bg-emerald-400" : "bg-slate-200"}`} />

                {/* Step 3 */}
                <div
                  onClick={() => currentStep > 3 && setCurrentStep(3)}
                  className={`flex items-center gap-2 ${currentStep > 3 ? "cursor-pointer" : ""}`}
                >
                  <div
                    className={`flex size-7 sm:size-8 items-center justify-center rounded-full text-xs font-extrabold transition-all ${
                      currentStep === 3
                        ? "bg-[#035352] text-white ring-4 ring-[#035352]/10"
                        : currentStep > 3
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {currentStep > 3 ? "✓" : "3"}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 3</p>
                    <p className={`text-xs font-bold ${currentStep === 3 ? "text-[#035352]" : "text-slate-700"}`}>
                      Verify Email
                    </p>
                  </div>
                </div>

                <div className={`h-0.5 flex-1 mx-2 sm:mx-3 rounded-full transition-all ${currentStep > 3 ? "bg-emerald-400" : "bg-slate-200"}`} />

                {/* Step 4 */}
                <div className="flex items-center gap-2">
                  <div
                    className={`flex size-7 sm:size-8 items-center justify-center rounded-full text-xs font-extrabold transition-all ${
                      currentStep === 4
                        ? "bg-[#035352] text-white ring-4 ring-[#035352]/10"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    4
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step 4</p>
                    <p className={`text-xs font-bold ${currentStep === 4 ? "text-[#035352]" : "text-slate-700"}`}>
                      Set Password
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 animate-in fade-in duration-200">
                <AlertCircle className="size-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8" data-testid="register-business-form">
              {/* ============================================================== */}
              {/* STEP 1: Organisation Information */}
              {/* ============================================================== */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-bold text-[#035352]">
                    <Building2 className="size-4 text-[#05706f]" />
                    <span>Step 1: Organisation Information</span>
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
                      <Upload className="size-3.5 text-slate-400" /> Organisation Logo (Optional)
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

                  {/* Step 1 Actions */}
                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/")}
                      className="h-11 px-6 rounded-full border border-slate-300 text-xs font-semibold text-[#172525] hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleProceedToStep2}
                      className="h-11 px-8 rounded-full bg-[#035352] text-xs font-bold text-white hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 flex items-center gap-2 cursor-pointer"
                      data-testid="btn-step1-next"
                    >
                      <span>Next: Workplace Address</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 2: Workplace Address & Settings */}
              {/* ============================================================== */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-bold text-[#035352]">
                    <MapPin className="size-4 text-[#05706f]" />
                    <span>Step 2: Workplace Address & Location</span>
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  {/* Step 2 Actions */}
                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="h-11 px-6 rounded-full border border-slate-300 text-xs font-semibold text-[#172525] hover:bg-slate-100 cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft className="size-3.5" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleProceedToStep3}
                      className="h-11 px-8 rounded-full bg-[#035352] text-xs font-bold text-white hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 flex items-center gap-2 cursor-pointer"
                      data-testid="btn-step2-next"
                    >
                      <span>Next: Verify Business Email</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 3: Business Email & OTP Verification (Separate Step) */}
              {/* ============================================================== */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-bold text-[#035352]">
                    <Mail className="size-4 text-[#05706f]" />
                    <span>Step 3: Business Email & OTP Verification</span>
                  </div>

                  <div className="rounded-2xl border border-[#035352]/20 bg-[#035352]/5 p-4 text-xs text-[#035352] space-y-1">
                    <p className="font-bold">✉️ Security Email Verification</p>
                    <p className="text-[#4a5d5c] leading-relaxed">
                      Enter your official business email address. When you click send, a 4-digit verification code will be sent to verify ownership before setting up your administrator passwords.
                    </p>
                  </div>

                  {/* Business Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-[#172525] mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Mail className="size-3.5 text-slate-400" /> Business Email <span className="text-red-500">*</span>
                      </span>
                      {emailVerified && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          ✓ Verified
                        </span>
                      )}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => {
                          handleInputChange(e);
                          setEmailVerified(false);
                          setOtpSent(false);
                          setOtpCode("");
                        }}
                        disabled={emailVerified}
                        placeholder="admin@yourcompany.com"
                        required
                        className="flex-1 h-11 px-5 rounded-full border border-slate-200 bg-white text-sm text-[#172525] shadow-sm focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                        data-testid="input-org-email"
                      />
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || !formData.email.trim()}
                        className="h-11 px-6 rounded-full bg-[#035352] hover:bg-[#023e3d] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                        data-testid="btn-send-otp"
                      >
                        {isSendingOtp ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" /> Sending...
                          </>
                        ) : otpSent ? (
                          <>
                            <RotateCw className="size-3.5" /> Resend Code
                          </>
                        ) : (
                          <>
                            <Mail className="size-3.5" /> Send Code
                          </>
                        )}
                      </Button>
                    </div>
                  </div>


                  {/* OTP Message Banner */}
                  {otpMessage && (
                    <div className="flex items-center gap-2.5 rounded-2xl border border-teal-200 bg-teal-50/80 p-3.5 text-xs font-medium text-teal-800 animate-in fade-in duration-200">
                      <CheckCircle2 className="size-4 shrink-0 text-teal-600" />
                      <span>{otpMessage}</span>
                    </div>
                  )}

                  {/* OTP Input Section (Visible when code dispatched) */}
                  {otpSent && (
                    <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm animate-in fade-in duration-200">
                      <div>
                        <label className="block text-xs font-bold text-[#172525] mb-1.5">
                          Enter Verification Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="••••••"
                          className="w-full sm:w-60 h-12 px-4 rounded-xl border border-slate-300 text-center font-mono text-xl tracking-[0.5em] font-bold text-[#035352] shadow-sm focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20"
                          data-testid="input-org-otp"
                        />
                        <p className="mt-1.5 text-[11px] text-slate-500">
                          Enter the code sent to your email to verify ownership.
                        </p>
                      </div>

                      <div className="pt-2">
                        <Button
                          type="button"
                          onClick={handleVerifyOtpAndProceed}
                          disabled={isVerifyingOtp || !otpCode.trim()}
                          className="h-11 px-8 rounded-full bg-[#035352] hover:bg-[#023e3d] text-white text-xs font-bold shadow-md shadow-[#035352]/20 flex items-center gap-2 cursor-pointer"
                          data-testid="btn-verify-otp-proceed"
                        >
                          {isVerifyingOtp ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin" /> Verifying Code...
                            </>
                          ) : (
                            <>
                              <span>Verify & Proceed to Set Password</span>
                              <ArrowRight className="size-3.5" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3 Navigation Actions */}
                  <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="h-11 px-6 rounded-full border border-slate-300 text-xs font-semibold text-[#172525] hover:bg-slate-100 cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft className="size-3.5" /> Back
                    </Button>

                    {!otpSent && (
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || !formData.email.trim()}
                        className="h-11 px-8 rounded-full bg-[#035352] text-xs font-bold text-white hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 flex items-center gap-2 cursor-pointer"
                      >
                        {isSendingOtp ? "Sending Code..." : "Send Verification Code"}
                        <ArrowRight className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 4: Master Admin Password & Non-Editable Email (Final Step) */}
              {/* ============================================================== */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-sm font-bold text-[#035352]">
                    <KeyRound className="size-4 text-[#05706f]" />
                    <span>Step 4: Portal Login Credentials</span>
                  </div>

                  {/* Info Notice */}
                  <div className="rounded-2xl border border-[#035352]/20 bg-[#035352]/5 p-4 text-xs text-[#035352] space-y-1">
                    <p className="font-bold">🔐 Master Administrator Credentials</p>
                    <p className="text-[#4a5d5c] leading-relaxed">
                      Your business email is verified! Now create the password you will use to log in to your Organisation Super Admin Portal once approved.
                    </p>
                  </div>

                  {/* Registered Verified Email (Non-Editable) */}
                  <div>
                    <label className="block text-xs font-bold text-[#172525] mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Lock className="size-3.5 text-slate-500" /> Verified Business Email (Login Username)
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        ✓ Verified & Non-Editable
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        readOnly
                        disabled
                        className="w-full h-11 px-5 rounded-full border border-slate-300 bg-slate-100 text-sm font-semibold text-slate-600 cursor-not-allowed shadow-inner"
                        data-testid="input-org-email-readonly"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEmailVerified(false);
                          setOtpSent(false);
                          setOtpCode("");
                          setCurrentStep(3);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#035352] hover:underline px-2 py-1"
                      >
                        Change Email
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 px-2">
                      Locked to your verified business email from Step 3.
                    </p>
                  </div>

                  {/* Set Password */}
                  <div>
                    <label className="block text-xs font-bold text-[#172525] mb-1.5 flex items-center justify-between">
                      <span>Set Password (New Password) <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-slate-400 font-normal">Min. 6 characters</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        required
                        className="w-full h-11 px-5 pr-12 rounded-full border border-slate-200 bg-white text-sm text-[#172525] shadow-sm focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                        data-testid="input-org-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Re-enter Password */}
                  <div>
                    <label className="block text-xs font-bold text-[#172525] mb-1.5">
                      Re-enter Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Re-enter your password"
                        required
                        className="w-full h-11 px-5 pr-12 rounded-full border border-slate-200 bg-white text-sm text-[#172525] shadow-sm focus:border-[#035352] focus:outline-none focus:ring-2 focus:ring-[#035352]/20 transition-all"
                        data-testid="input-org-confirm-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="mt-1 text-[11px] font-semibold text-red-600 px-2">
                        Passwords do not match.
                      </p>
                    )}
                  </div>

                  {/* Review Summary Card */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-xs space-y-2">
                    <p className="font-bold text-slate-800">Registration Summary</p>
                    <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Organisation</span>
                        <span className="font-semibold text-slate-800 truncate block">{formData.name || "-"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Verified Email</span>
                        <span className="font-semibold text-[#035352] truncate block">{formData.email || "-"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Workplace</span>
                        <span className="truncate block">{formData.city ? `${formData.city}, ${formData.state || formData.country}` : "-"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Phone</span>
                        <span className="truncate block">{formData.phone || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 Actions (Submit) */}
                  <div className="pt-6 border-t border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(3)}
                        disabled={loading}
                        className="w-full sm:w-auto h-12 px-6 rounded-full border border-slate-300 text-xs font-semibold text-[#172525] hover:bg-slate-100 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ArrowLeft className="size-3.5" /> Back
                      </Button>
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
                            <ShieldCheck className="size-4" /> Submit Organisation Registration
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-5 text-xs text-[#718786] pt-1">
                      <span className="flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="size-3.5 text-emerald-600" /> 256-bit Encrypted
                      </span>
                      <span className="size-1 rounded-full bg-slate-300" />
                      <span className="flex items-center gap-1.5 font-medium">
                        <Zap className="size-3.5 text-amber-500" /> Fast Verification
                      </span>
                    </div>
                  </div>
                </div>
              )}
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
