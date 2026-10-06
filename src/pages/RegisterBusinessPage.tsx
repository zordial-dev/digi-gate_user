import { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ArrowLeft,
  ArrowRight,
  Zap,
  Lock,
  Eye,
  EyeOff,
  Mail,
  KeyRound,
  RotateCw,
  ChevronDown,
  Check,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { organisationApi } from "@/api/services";

const COUNTRY_CODES = [
  { code: "+91", flag: "🇮🇳", name: "India", iso: "IN" },
  { code: "+1", flag: "🇺🇸", name: "United States / Canada", iso: "US" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom", iso: "UK" },
  { code: "+971", flag: "🇦🇪", name: "United Arab Emirates", iso: "AE" },
  { code: "+65", flag: "🇸🇬", name: "Singapore", iso: "SG" },
  { code: "+61", flag: "🇦🇺", name: "Australia", iso: "AU" },
  { code: "+49", flag: "🇩🇪", name: "Germany", iso: "DE" },
  { code: "+33", flag: "🇫🇷", name: "France", iso: "FR" },
  { code: "+81", flag: "🇯🇵", name: "Japan", iso: "JP" },
  { code: "+86", flag: "🇨🇳", name: "China", iso: "CN" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia", iso: "SA" },
  { code: "+974", flag: "🇶🇦", name: "Qatar", iso: "QA" },
  { code: "+968", flag: "🇴🇲", name: "Oman", iso: "OM" },
  { code: "+965", flag: "🇰🇼", name: "Kuwait", iso: "KW" },
  { code: "+973", flag: "🇧🇭", name: "Bahrain", iso: "BH" },
  { code: "+880", flag: "🇧🇩", name: "Bangladesh", iso: "BD" },
  { code: "+94", flag: "🇱🇰", name: "Sri Lanka", iso: "LK" },
  { code: "+977", flag: "🇳🇵", name: "Nepal", iso: "NP" },
];

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

  // Country code state & custom dropdown
  const [countryCode, setCountryCode] = useState("+91");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Close country dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  const filteredCountries = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) ||
      c.code.includes(countrySearchQuery) ||
      c.iso.toLowerCase().includes(countrySearchQuery.toLowerCase())
  );

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
    if (!formData.phone.trim()) {
      setError("Contact phone number is required.");
      return;
    }
    if (!logoFile && !logoPreview) {
      setError("Organisation logo is required.");
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

      if (formData.phone.trim()) {
        const fullPhone = formData.phone.trim().startsWith("+")
          ? formData.phone.trim()
          : `${countryCode} ${formData.phone.trim()}`;
        data.append("phone", fullPhone);
      }
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
    <div className="min-h-screen bg-[#F4F7F6] text-[#172525] flex flex-col justify-between overflow-x-hidden" data-testid="register-business-page">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white shadow-sm gpu-layer">
        <div className="mx-auto flex h-[64px] sm:h-[72px] max-w-5xl items-center justify-between px-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Digi-Gate Home">
            <img
              src="/digigate_logo.png"
              alt="DigiGate Logo"
              className="h-9 sm:h-10 w-auto object-contain rounded-md"
            />
            <div className="flex flex-col text-left">
              <span className="font-heading text-lg sm:text-xl font-black tracking-tight text-[#035352] leading-none">
                Digi<span className="text-[#05706f]">-Gate</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-[#035352]/70 leading-none mt-1">
                Visitor System
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-slate-200 bg-[#F4F7F6] px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-[#035352] hover:bg-[#e6f0f0] transition-colors shadow-sm"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back <span className="hidden sm:inline">to Home</span></span>
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
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-[#035352]/10 p-5 sm:p-8 space-y-6 animate-in fade-in duration-300" data-testid="register-business-form-card">
            {/* Page Header */}
            <div className="text-center sm:text-left space-y-1">
              <h1 className="mt-0 font-heading text-2xl sm:text-3xl font-black tracking-tight text-[#172525]" data-testid="register-page-title">
                Register Your Organisation
              </h1>
              <p className="text-xs sm:text-sm text-[#4a5d5c] leading-relaxed" data-testid="register-page-description">
                Complete these 4 steps to register your organisation.
              </p>
            </div>

            {/* Step Progress Stepper Bar */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/80 p-3 sm:p-3.5 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="rounded-full bg-[#035352] text-[#F3E8BC] text-[10px] sm:text-[11px] font-extrabold px-2.5 py-1 shadow-sm shrink-0">
                    Step {currentStep} of 4
                  </span>
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#172525] truncate">
                    {currentStep === 1 && "Organisation Information"}
                    {currentStep === 2 && "Workplace & Location"}
                    {currentStep === 3 && "Business Email & OTP"}
                    {currentStep === 4 && "Set Master Password"}
                  </h3>
                </div>
                <span className="text-[11px] sm:text-xs font-black text-[#035352] font-mono shrink-0 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  {currentStep * 25}%
                </span>
              </div>

              {/* 4-Segment Progress Bar */}
              <div className="grid grid-cols-4 gap-1.5 pt-0.5">
                {[1, 2, 3, 4].map((step) => {
                  const isCompleted = currentStep > step;
                  const isActive = currentStep === step;
                  return (
                    <button
                      key={step}
                      type="button"
                      onClick={() => isCompleted && setCurrentStep(step as 1 | 2 | 3 | 4)}
                      disabled={!isCompleted}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted
                          ? "bg-emerald-500 cursor-pointer hover:opacity-90"
                          : isActive
                          ? "bg-[#035352] ring-2 ring-[#035352]/20"
                          : "bg-slate-200 cursor-not-allowed"
                      }`}
                      title={`Step ${step}`}
                    />
                  );
                })}
              </div>
            </div>

            {error && !(currentStep === 3 && otpSent) && (
              <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 animate-in fade-in duration-200">
                <AlertCircle className="size-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" data-testid="register-business-form">
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
                      <Phone className="size-3.5 text-slate-400" /> Contact Phone <span className="text-red-500">*</span>
                    </label>

                    {/* Unified Phone Input Container */}
                    <div className="w-full h-11 flex items-center rounded-full border border-slate-200 bg-white px-3 shadow-sm focus-within:border-[#035352] focus-within:ring-2 focus-within:ring-[#035352]/20 transition-all">
                      {/* Custom Country Code Dropdown Trigger */}
                      <div ref={countryDropdownRef} className="relative shrink-0 border-r border-slate-200/80 pr-2">
                        <button
                          type="button"
                          onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold text-[#172525] hover:bg-[#e6f0f0] transition-colors cursor-pointer"
                          aria-label="Select Country Code"
                        >
                          <span className="text-sm">{selectedCountry.flag}</span>
                          <span>{selectedCountry.code}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">({selectedCountry.iso})</span>
                          <ChevronDown
                            className={`size-3 text-[#035352] transition-transform duration-200 ${
                              isCountryDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Custom Floating Themed Menu */}
                        {isCountryDropdownOpen && (
                          <div className="absolute left-0 top-full mt-2.5 z-50 w-64 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl shadow-[#035352]/10 animate-in fade-in zoom-in-95 duration-150">
                            {/* Search Filter Header */}
                            <div className="flex items-center gap-2 rounded-xl bg-[#F4F7F6] px-3 py-1.5 mb-1.5 border border-slate-100">
                              <Search className="size-3.5 text-[#035352]" />
                              <input
                                type="text"
                                value={countrySearchQuery}
                                onChange={(e) => setCountrySearchQuery(e.target.value)}
                                placeholder="Search country or code..."
                                className="w-full bg-transparent text-xs text-[#172525] placeholder:text-slate-400 outline-none"
                                autoFocus
                              />
                            </div>

                            {/* Country List */}
                            <div className="max-h-52 overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
                              {filteredCountries.length > 0 ? (
                                filteredCountries.map((country) => {
                                  const isSelected = country.code === countryCode;
                                  return (
                                    <button
                                      key={country.code + country.iso}
                                      type="button"
                                      onClick={() => {
                                        setCountryCode(country.code);
                                        setIsCountryDropdownOpen(false);
                                        setCountrySearchQuery("");
                                      }}
                                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                                        isSelected
                                          ? "bg-[#035352] text-white font-bold shadow-sm"
                                          : "text-[#172525] hover:bg-[#e6f0f0] hover:text-[#035352] font-medium"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <span className="text-sm">{country.flag}</span>
                                        <span className="font-bold">{country.code}</span>
                                        <span className={`truncate text-[11px] ${isSelected ? "text-teal-100" : "text-slate-500"}`}>
                                          {country.name}
                                        </span>
                                      </div>
                                      {isSelected && <Check className="size-3.5 text-[#F3E8BC] shrink-0 ml-1" />}
                                    </button>
                                  );
                                })
                              ) : (
                                <p className="p-3 text-center text-xs text-slate-400 font-medium">
                                  No country found
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Phone Input */}
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="98765 43210"
                        required
                        className="flex-1 min-w-0 bg-transparent px-3 text-sm text-[#172525] placeholder:text-slate-400 outline-none"
                        data-testid="input-org-phone"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172525] mb-1.5 flex items-center gap-1">
                      <Upload className="size-3.5 text-slate-400" /> Organisation Logo <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      {/* Prominent Large Logo Preview Box */}
                      <div className="relative w-28 h-28 shrink-0 rounded-2xl border-2 border-dashed border-[#035352]/30 bg-[#F4F7F6] flex items-center justify-center overflow-hidden shadow-md transition-all">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Organisation Logo Preview"
                            className="size-full object-contain p-2 rounded-xl bg-white"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-slate-400">
                            <Building2 className="size-8 text-[#035352]/40" />
                            <span className="text-[10px] font-bold text-slate-400">No Logo</span>
                          </div>
                        )}
                      </div>

                      {/* Upload Control & Information */}
                      <div className="flex-1 min-w-0 space-y-2">
                        {logoPreview ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                                Logo Attached
                              </span>
                              <span className="text-xs font-semibold text-[#172525] truncate">
                                {logoFile?.name}
                              </span>
                            </div>
                            <p className="text-xs text-[#4a5d5c]">
                              This logo will appear on your organisation's visitor kiosk, gate passes, and portal header.
                            </p>
                            <div className="flex items-center gap-3 pt-1">
                              <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#035352] text-xs font-bold text-white hover:bg-[#023e3d] transition-all shadow-sm cursor-pointer">
                                <Upload className="size-3.5" /> Change Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleLogoChange}
                                  className="hidden"
                                  data-testid="input-org-logo-change"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={removeLogo}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-rose-200 bg-rose-50 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-all cursor-pointer"
                              >
                                <X className="size-3.5" /> Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs text-[#4a5d5c] leading-relaxed">
                              Upload your official business or institution logo (PNG, JPG, SVG). It will be displayed on digital visitor passes and host notifications.
                            </p>
                            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-dashed border-[#035352]/50 bg-[#e6f0f0]/60 text-xs font-bold text-[#035352] hover:bg-[#e6f0f0] transition-all shadow-sm cursor-pointer">
                              <Upload className="size-4 text-[#05706f]" />
                              <span>Select Logo Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="hidden"
                                data-testid="input-org-logo"
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172525] mb-1.5 flex items-center gap-1">
                      <Globe className="size-3.5 text-slate-400" /> Website URL (Optional)
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

                  {/* Step 1 Actions */}
                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/")}
                      className="h-10 sm:h-11 px-5 sm:px-6 rounded-full border border-slate-200 text-xs font-bold text-[#172525] hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleProceedToStep2}
                      className="h-10 sm:h-11 px-6 sm:px-8 rounded-full bg-[#035352] text-xs font-bold text-white hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 flex items-center gap-1.5 cursor-pointer"
                      data-testid="btn-step1-next"
                    >
                      <span>Next: Location</span>
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
                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="h-10 sm:h-11 px-5 sm:px-6 rounded-full border border-slate-200 text-xs font-bold text-[#172525] hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft className="size-3.5" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={handleProceedToStep3}
                      className="h-10 sm:h-11 px-6 sm:px-8 rounded-full bg-[#035352] text-xs font-bold text-white hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 flex items-center gap-1.5 cursor-pointer"
                      data-testid="btn-step2-next"
                    >
                      <span>Next: Verify Email</span>
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

                    {/* Integrated Pill Input Container */}
                    <div className="w-full flex items-center rounded-full border border-slate-200 bg-white p-1 pl-4 shadow-sm focus-within:border-[#035352] focus-within:ring-2 focus-within:ring-[#035352]/20 transition-all">
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
                        className="flex-1 min-w-0 bg-transparent text-xs sm:text-sm text-[#172525] placeholder:text-slate-400 outline-none disabled:cursor-not-allowed"
                        data-testid="input-org-email"
                      />
                      <Button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || !formData.email.trim()}
                        className="h-9 px-4 sm:px-5 rounded-full bg-[#035352] hover:bg-[#023e3d] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ml-1"
                        data-testid="btn-send-otp"
                      >
                        {isSendingOtp ? (
                          <>
                            <Loader2 className="size-3.5 animate-spin" /> Sending...
                          </>
                        ) : otpSent ? (
                          <>
                            <RotateCw className="size-3.5" /> Resend
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="size-3.5" /> Verify
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
                    <div className="py-5 px-6 sm:py-6 sm:px-8 rounded-2xl border border-slate-200 bg-white shadow-md shadow-[#035352]/5 animate-in fade-in duration-200 flex flex-col items-center justify-center text-center">
                      <div className="w-full max-w-md space-y-2.5 flex flex-col items-center">
                        <label className="block text-sm sm:text-base font-extrabold text-[#172525]">
                          Enter Verification Code <span className="text-red-500">*</span>
                        </label>

                        {/* OTP Input */}
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="••••••"
                          className="w-full max-w-xs h-11 sm:h-12 px-4 rounded-xl border-2 border-slate-300 text-center font-mono text-xl sm:text-2xl tracking-[0.5em] font-black text-[#035352] shadow-sm focus:border-[#035352] focus:outline-none focus:ring-4 focus:ring-[#035352]/15 transition-all"
                          data-testid="input-org-otp"
                        />

                        {/* Error Alert Tag directly under the OTP field */}
                        {error && (
                          <div className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 animate-in fade-in duration-200 shadow-sm">
                            <AlertCircle className="size-3.5 shrink-0 text-red-500" />
                            <span>{error}</span>
                          </div>
                        )}

                        <p className="text-xs text-[#4a5d5c] font-medium">
                          Enter the code sent to your email to verify ownership.
                        </p>

                        <div className="pt-1.5 w-full flex justify-center">
                          <Button
                            type="button"
                            onClick={handleVerifyOtpAndProceed}
                            disabled={isVerifyingOtp || !otpCode.trim()}
                            className="h-11 px-7 rounded-full bg-[#035352] hover:bg-[#023e3d] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#035352]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                    </div>
                  )}

                  {/* Step 3 Navigation Actions */}
                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="h-10 sm:h-11 px-5 sm:px-6 rounded-full border border-slate-200 text-xs font-bold text-[#172525] hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft className="size-3.5" /> Back
                    </Button>

                    <Button
                      type="button"
                      onClick={() => {
                        if (emailVerified) {
                          setCurrentStep(4);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      disabled={!emailVerified}
                      className="h-10 sm:h-11 px-6 sm:px-8 rounded-full bg-[#035352] text-xs font-bold text-white hover:bg-[#023e3d] shadow-md shadow-[#035352]/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>Next</span>
                      <ArrowRight className="size-3.5" />
                    </Button>
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
                  <div className="pt-5 border-t border-slate-100 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(3)}
                        disabled={loading}
                        className="h-10 sm:h-11 px-5 sm:px-6 rounded-full border border-slate-200 text-xs font-bold text-[#172525] hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ArrowLeft className="size-3.5" /> Back
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="h-10 sm:h-11 px-6 sm:px-8 rounded-full bg-[#035352] text-xs sm:text-sm font-bold text-white hover:bg-[#023e3d] transition-all shadow-md shadow-[#035352]/20 flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-initial"
                        data-testid="submit-register-business-btn"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="size-4 animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="size-4" /> Submit Registration
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-xs text-[#718786] pt-1">
                      <span className="flex items-center gap-1 font-medium">
                        <ShieldCheck className="size-3.5 text-emerald-600" /> 256-bit Encrypted
                      </span>
                      <span className="size-1 rounded-full bg-slate-300" />
                      <span className="flex items-center gap-1 font-medium">
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
