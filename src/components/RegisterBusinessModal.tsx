import { useState, useMemo, useRef, type ChangeEvent, type FormEvent } from "react";
import { Country, State, City } from "country-state-city";
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
  Check,
  Search,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { organisationApi, pincodeApi } from "@/api/services";

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

  // Pincode lookup state
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState<"success" | "error" | null>(null);
  const [pincodeMessage, setPincodeMessage] = useState<string>("");
  const pincodeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Country-State-City dynamic data
  const allCountries = useMemo(() => Country.getAllCountries(), []);

  const selectedCountryObj = useMemo(() => {
    if (!formData.country) return allCountries.find((c) => c.isoCode === "IN");
    return (
      allCountries.find(
        (c) =>
          c.name.toLowerCase() === formData.country.toLowerCase() ||
          c.isoCode.toLowerCase() === formData.country.toLowerCase()
      ) || allCountries.find((c) => c.isoCode === "IN")
    );
  }, [formData.country, allCountries]);

  const countryIsoCode = selectedCountryObj?.isoCode || "IN";
  const isIndia = countryIsoCode === "IN";

  const postalCodeLabel = useMemo(() => {
    if (isIndia) return "Pincode / Postal Code";
    if (countryIsoCode === "US") return "ZIP Code";
    return "Postal / ZIP Code";
  }, [isIndia, countryIsoCode]);

  const postalCodePlaceholder = useMemo(() => {
    if (isIndia) return "e.g. 110001";
    if (countryIsoCode === "US") return "e.g. 90210";
    if (countryIsoCode === "GB") return "e.g. SW1A";
    if (countryIsoCode === "CA") return "e.g. M5V";
    if (countryIsoCode === "DE") return "e.g. 10115";
    return "e.g. 90210";
  }, [isIndia, countryIsoCode]);

  const availableStates = useMemo(() => {
    return State.getStatesOfCountry(countryIsoCode);
  }, [countryIsoCode]);

  const selectedStateObj = useMemo(() => {
    if (!formData.state) return null;
    return availableStates.find(
      (s) =>
        s.name.toLowerCase() === formData.state.toLowerCase() ||
        s.isoCode.toLowerCase() === formData.state.toLowerCase()
    );
  }, [formData.state, availableStates]);

  const availableCities = useMemo(() => {
    if (selectedStateObj) {
      return City.getCitiesOfState(countryIsoCode, selectedStateObj.isoCode);
    }
    return City.getCitiesOfCountry(countryIsoCode) || [];
  }, [countryIsoCode, selectedStateObj]);

  const countryOptions = useMemo(() => {
    const map = new Map<string, { value: string; label: string; flag?: string; sublabel?: string }>();
    allCountries.forEach((c) => {
      if (!map.has(c.name.toLowerCase())) {
        map.set(c.name.toLowerCase(), {
          value: c.name,
          label: c.name,
          flag: c.flag,
          sublabel: c.isoCode,
        });
      }
    });
    return Array.from(map.values());
  }, [allCountries]);

  const stateOptions = useMemo(() => {
    const map = new Map<string, { value: string; label: string }>();
    availableStates.forEach((s) => {
      if (!map.has(s.name.toLowerCase())) {
        map.set(s.name.toLowerCase(), { value: s.name, label: s.name });
      }
    });
    if (formData.state && !map.has(formData.state.toLowerCase())) {
      map.set(formData.state.toLowerCase(), { value: formData.state, label: formData.state });
    }
    return Array.from(map.values());
  }, [availableStates, formData.state]);

  const cityOptions = useMemo(() => {
    const map = new Map<string, { value: string; label: string }>();
    availableCities.forEach((c) => {
      if (!map.has(c.name.toLowerCase())) {
        map.set(c.name.toLowerCase(), { value: c.name, label: c.name });
      }
    });
    if (formData.city && !map.has(formData.city.toLowerCase())) {
      map.set(formData.city.toLowerCase(), { value: formData.city, label: formData.city });
    }
    return Array.from(map.values());
  }, [availableCities, formData.city]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchPincodeDetails = async (pin: string, explicitCountryIso?: string) => {
    const cleanPin = pin.trim();
    const iso = (explicitCountryIso || countryIsoCode || "IN").toUpperCase();

    if (!cleanPin) {
      setPincodeStatus(null);
      setPincodeMessage("");
      return;
    }

    if (iso === "IN") {
      if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
        setPincodeStatus(null);
        setPincodeMessage("");
        return;
      }
    } else {
      if (cleanPin.length < 3) {
        setPincodeStatus(null);
        setPincodeMessage("");
        return;
      }
    }

    setPincodeLoading(true);
    setPincodeStatus(null);
    setPincodeMessage("");

    const res = await pincodeApi.lookup(cleanPin, iso);
    setPincodeLoading(false);

    if (res.success) {
      setPincodeStatus("success");
      const city = res.city || res.district || "";
      const state = res.state || "";
      const locationText = [city, state].filter(Boolean).join(", ");
      setPincodeMessage(locationText ? `Auto-filled: ${locationText}` : "Auto-filled");

      let stateToSet = res.state || "";
      if (res.state || res.stateAbbreviation) {
        const statesForCountry = State.getStatesOfCountry(iso);
        const matchedState = statesForCountry.find(
          (s) =>
            (res.state && s.name.toLowerCase() === res.state.toLowerCase()) ||
            (res.stateAbbreviation && s.isoCode.toLowerCase() === res.stateAbbreviation.toLowerCase()) ||
            (res.state && s.isoCode.toLowerCase() === res.state.toLowerCase())
        );
        if (matchedState) {
          stateToSet = matchedState.name;
        }
      }

      setFormData((prev) => ({
        ...prev,
        city: city || prev.city,
        state: stateToSet || prev.state,
        country: prev.country,
      }));
    } else {
      setPincodeStatus("error");
      setPincodeMessage(res.message || "No records found for this postal code");
    }
  };

  const handlePincodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (isIndia) {
      value = value.replace(/\D/g, "").slice(0, 6);
    } else {
      value = value.replace(/[^a-zA-Z0-9 -]/g, "").slice(0, 10);
    }
    setFormData((prev) => ({ ...prev, pincode: value }));

    if (pincodeDebounceRef.current) {
      clearTimeout(pincodeDebounceRef.current);
    }

    if (isIndia) {
      if (value.length === 6) {
        fetchPincodeDetails(value, "IN");
      } else {
        setPincodeStatus(null);
        setPincodeMessage("");
      }
    } else if (countryIsoCode === "US") {
      const clean = value.trim();
      if (/^\d{5}$/.test(clean)) {
        fetchPincodeDetails(clean, "US");
      } else if (clean.length < 5) {
        setPincodeStatus(null);
        setPincodeMessage("");
      } else {
        pincodeDebounceRef.current = setTimeout(() => {
          fetchPincodeDetails(clean, "US");
        }, 600);
      }
    } else {
      const clean = value.trim();
      if (clean.length >= 3) {
        pincodeDebounceRef.current = setTimeout(() => {
          fetchPincodeDetails(clean, countryIsoCode);
        }, 600);
      } else {
        setPincodeStatus(null);
        setPincodeMessage("");
      }
    }
  };

  const handlePincodeBlur = () => {
    const clean = formData.pincode.trim();
    if (!clean || pincodeLoading) return;
    if (isIndia && clean.length === 6 && pincodeStatus !== "success") {
      fetchPincodeDetails(clean, "IN");
    } else if (!isIndia && clean.length >= 3 && pincodeStatus !== "success") {
      fetchPincodeDetails(clean, countryIsoCode);
    }
  };

  const handlePincodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const clean = formData.pincode.trim();
      if (clean) {
        if (pincodeDebounceRef.current) clearTimeout(pincodeDebounceRef.current);
        fetchPincodeDetails(clean, countryIsoCode);
      }
    }
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
      setPincodeLoading(false);
      setPincodeStatus(null);
      setPincodeMessage("");
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
                      <label className="block text-xs font-semibold text-[#172525] mb-1">
                        Country
                      </label>
                      <SearchableSelect
                        options={countryOptions}
                        value={formData.country}
                        onChange={(val) => {
                          setFormData((prev) => ({
                            ...prev,
                            country: val,
                            state: "",
                            city: "",
                            pincode: "",
                          }));
                          setPincodeStatus(null);
                          setPincodeMessage("");
                        }}
                        placeholder="Select Country"
                        searchPlaceholder="Type to search country..."
                        testId="input-org-country"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-[#172525]">
                          {postalCodeLabel} <span className="text-[10px] text-slate-400 font-normal">(Auto-fetch)</span>
                        </label>
                        {pincodeLoading && (
                          <span className="text-[10px] font-medium text-[#035352] flex items-center gap-1">
                            <Loader2 className="size-3 animate-spin" /> Fetching...
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handlePincodeChange}
                          onBlur={handlePincodeBlur}
                          onKeyDown={handlePincodeKeyDown}
                          maxLength={isIndia ? 6 : 10}
                          placeholder={postalCodePlaceholder}
                          className={`w-full h-9 pl-4 pr-8 rounded-full border bg-[#F4F7F6] text-xs text-[#172525] focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                            pincodeStatus === "success"
                              ? "border-emerald-400 focus:border-emerald-600 focus:ring-emerald-500/20"
                              : pincodeStatus === "error"
                              ? "border-amber-400 focus:border-amber-500 focus:ring-amber-500/20"
                              : "border-slate-200 focus:border-[#035352] focus:ring-[#035352]/20"
                          }`}
                          data-testid="input-org-pincode"
                        />
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          {pincodeLoading ? (
                            <Loader2 className="size-3.5 animate-spin text-[#035352]" />
                          ) : pincodeStatus === "success" ? (
                            <CheckCircle2 className="size-3.5 text-emerald-600" />
                          ) : pincodeStatus === "error" ? (
                            <AlertCircle className="size-3.5 text-amber-500" />
                          ) : formData.pincode.trim().length >= 3 ? (
                            <button
                              type="button"
                              onClick={() => fetchPincodeDetails(formData.pincode)}
                              title="Lookup postal code"
                              className="text-slate-400 hover:text-[#035352] transition-colors p-0.5 rounded cursor-pointer"
                            >
                              <Search className="size-3" />
                            </button>
                          ) : null}
                        </div>
                      </div>
                      {pincodeMessage && (
                        <p
                          className={`mt-1 text-[10px] font-medium flex items-center gap-1 ${
                            pincodeStatus === "success" ? "text-emerald-700" : "text-amber-600"
                          }`}
                        >
                          {pincodeStatus === "success" && <Check className="size-3 shrink-0" />}
                          <span>{pincodeMessage}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#172525] mb-1">
                        State / Province
                      </label>
                      <SearchableSelect
                        options={stateOptions}
                        value={formData.state}
                        onChange={(val) => {
                          setFormData((prev) => ({ ...prev, state: val, city: "" }));
                        }}
                        placeholder={stateOptions.length > 0 ? "Select State / Province" : "Enter State"}
                        searchPlaceholder="Type to search state..."
                        testId="input-org-state"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#172525] mb-1">City</label>
                      <SearchableSelect
                        options={cityOptions}
                        value={formData.city}
                        onChange={(val) => {
                          setFormData((prev) => ({ ...prev, city: val }));
                        }}
                        placeholder={cityOptions.length > 0 ? "Select City" : "Enter City"}
                        searchPlaceholder="Type to search city..."
                        testId="input-org-city"
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
