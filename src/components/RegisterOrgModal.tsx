import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, X, CheckCircle2 } from "lucide-react";

export default function RegisterOrgModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phone: "",
    email: "",
    website: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/organisations/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "Failed to register organisation.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) {
        // Reset state on close
        setTimeout(() => {
          setSuccess(false);
          setError(null);
          setFormData({
            name: "", address: "", city: "", state: "",
            country: "", pincode: "", phone: "", email: "", website: ""
          });
        }, 300);
      }
    }}>
      <DialogContent className="max-w-xl overflow-hidden rounded-[1.75rem] border-[#DCE6F7] p-0 shadow-2xl shadow-[#06216B]/20 sm:rounded-[2rem]">
        <div className="relative overflow-hidden bg-[#061A54] px-6 pb-6 pt-7 text-white sm:px-8 sm:pt-8">
          <div className="absolute -right-12 -top-16 size-44 rounded-full bg-[#38BDF8]/20 blur-3xl" />
          <div className="relative">
            <DialogHeader className="text-left">
              <DialogTitle className="font-heading text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl flex items-center gap-3">
                <Building2 className="size-8 text-[#8EE7FF]" /> Register Organisation
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-6 text-blue-100/75">
                Join Digi-Gate and modernise your visitor experience.
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
        
        <div className="px-6 py-6 sm:px-8 sm:py-8 max-h-[70vh] overflow-y-auto bg-[#F8FAFC]">
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 className="size-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-[#06216B]">Registration Successful!</h3>
              <p className="mt-2 text-sm text-slate-600 max-w-sm">
                Your organisation has been registered and is currently pending approval. We will contact you shortly.
              </p>
              <Button onClick={() => onOpenChange(false)} className="mt-8 h-12 w-full rounded-xl bg-[#06216B] font-bold hover:bg-[#153D9F]">
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 text-sm font-bold text-rose-800">
                  {error}
                </div>
              )}
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3F5885]">Organisation Name *</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border border-[#DCE6F7] px-3.5 py-2.5 text-sm focus:border-[#06216B] focus:outline-none focus:ring-1 focus:ring-[#06216B]" placeholder="Zordial Tech" />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3F5885]">Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="w-full rounded-xl border border-[#DCE6F7] px-3.5 py-2.5 text-sm min-h-[80px] focus:border-[#06216B] focus:outline-none focus:ring-1 focus:ring-[#06216B]" placeholder="123 Tech Park, Phase 1" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3F5885]">City</label>
                  <input name="city" value={formData.city} onChange={handleChange} className="w-full rounded-xl border border-[#DCE6F7] px-3.5 py-2.5 text-sm focus:border-[#06216B] focus:outline-none focus:ring-1 focus:ring-[#06216B]" placeholder="Mumbai" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3F5885]">State</label>
                  <input name="state" value={formData.state} onChange={handleChange} className="w-full rounded-xl border border-[#DCE6F7] px-3.5 py-2.5 text-sm focus:border-[#06216B] focus:outline-none focus:ring-1 focus:ring-[#06216B]" placeholder="Maharashtra" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3F5885]">Country</label>
                  <input name="country" value={formData.country} onChange={handleChange} className="w-full rounded-xl border border-[#DCE6F7] px-3.5 py-2.5 text-sm focus:border-[#06216B] focus:outline-none focus:ring-1 focus:ring-[#06216B]" placeholder="India" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3F5885]">Pincode</label>
                  <input name="pincode" value={formData.pincode} onChange={handleChange} className="w-full rounded-xl border border-[#DCE6F7] px-3.5 py-2.5 text-sm focus:border-[#06216B] focus:outline-none focus:ring-1 focus:ring-[#06216B]" placeholder="400001" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3F5885]">Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-xl border border-[#DCE6F7] px-3.5 py-2.5 text-sm focus:border-[#06216B] focus:outline-none focus:ring-1 focus:ring-[#06216B]" placeholder="+91 9876543210" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3F5885]">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-xl border border-[#DCE6F7] px-3.5 py-2.5 text-sm focus:border-[#06216B] focus:outline-none focus:ring-1 focus:ring-[#06216B]" placeholder="contact@zordial.com" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#3F5885]">Website</label>
                <input name="website" value={formData.website} onChange={handleChange} className="w-full rounded-xl border border-[#DCE6F7] px-3.5 py-2.5 text-sm focus:border-[#06216B] focus:outline-none focus:ring-1 focus:ring-[#06216B]" placeholder="https://zordial.com" />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#DCE6F7]">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold text-slate-500 hover:text-slate-800">
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="h-11 rounded-xl bg-[#06216B] px-6 font-bold text-white hover:bg-[#153D9F]">
                  {loading ? "Submitting..." : "Register"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
