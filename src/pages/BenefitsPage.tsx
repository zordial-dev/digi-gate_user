import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  Building2,
  Check,
  Eye,
  ShieldCheck,
  UsersRound,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

export default function BenefitsPage() {
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#05706f] bg-[#e6f0f0] px-3.5 py-1 rounded-full">
              Platform Benefits
            </span>
            <h1 className="mt-5 font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-[#172525] leading-tight">
              A modern arrival experience built for speed, privacy, and clarity.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#4a5d5c] leading-relaxed max-w-2xl">
              Digi-Gate transforms traditional front-desk operations into an automated, contactless flow that eliminates reception friction and provides complete workplace oversight.
            </p>

            {/* Quick Stat Highlights */}
            <div className="mt-8 flex flex-wrap items-center gap-6 sm:gap-10 border-y border-slate-200 py-6">
              <div>
                <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[#035352]">18s</p>
                <p className="text-xs font-semibold text-[#4a5d5c] mt-0.5">Average Check-in Time</p>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div>
                <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[#035352]">0.4s</p>
                <p className="text-xs font-semibold text-[#4a5d5c] mt-0.5">Host Alert Dispatch</p>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div>
                <p className="font-mono text-3xl sm:text-4xl font-extrabold text-[#035352]">100%</p>
                <p className="text-xs font-semibold text-[#4a5d5c] mt-0.5">Visitor Privacy Protection</p>
              </div>
            </div>
          </div>

          {/* Core Benefit 1: Speed */}
          <div className="mt-14 space-y-4">
            <div className="flex items-center gap-2.5 text-[#05706f] font-mono text-xs font-bold uppercase tracking-wider">
              <Zap className="size-4" /> 01 • Arrival Velocity
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#172525]">
              Contactless guest check-in completed in seconds.
            </h2>
            <p className="text-sm sm:text-base text-[#4a5d5c] leading-relaxed">
              Visitors scan your gate or reception QR code using their standard smartphone camera. No mobile app downloads are required. Guests quickly fill their name, mobile number, and destination host in a fast, mobile-optimized browser flow.
            </p>
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#172525]">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  <Check className="size-3 stroke-[3]" />
                </span>
                <span>Instant browser launch with zero app install friction</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#172525]">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  <Check className="size-3 stroke-[3]" />
                </span>
                <span>Real-time SMS and WhatsApp OTP verification for genuine visitor profiles</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#172525]">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  <Check className="size-3 stroke-[3]" />
                </span>
                <span>Auto-complete employee directory to select hosts effortlessly</span>
              </div>
            </div>
          </div>

          <hr className="my-14 border-slate-200" />

          {/* Core Benefit 2: Visibility */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#05706f] font-mono text-xs font-bold uppercase tracking-wider">
              <Eye className="size-4" /> 02 • Live Host Awareness & Oversight
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#172525]">
              Instant host alerts and live on-site occupancy rosters.
            </h2>
            <p className="text-sm sm:text-base text-[#4a5d5c] leading-relaxed">
              Say goodbye to front-desk intercom delays and missed appointments. Hosts receive immediate WhatsApp and SMS push notifications the exact instant their guest finishes check-in, complete with visitor photo and purpose of visit.
            </p>
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#172525]">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  <Check className="size-3 stroke-[3]" />
                </span>
                <span>Multi-channel host notification via WhatsApp, SMS, and dashboard alerts</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#172525]">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  <Check className="size-3 stroke-[3]" />
                </span>
                <span>One-tap arrival acknowledgment so visitors know their host is on the way</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#172525]">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  <Check className="size-3 stroke-[3]" />
                </span>
                <span>Live on-site headcount roster for security management and emergency evacuation drills</span>
              </div>
            </div>
          </div>

          <hr className="my-14 border-slate-200" />

          {/* Core Benefit 3: Privacy & Security */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#05706f] font-mono text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="size-4" /> 03 • Complete Data Privacy & Governance
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#172525]">
              Enterprise-grade encryption with automated GDPR retention.
            </h2>
            <p className="text-sm sm:text-base text-[#4a5d5c] leading-relaxed">
              Paper registers expose every visitor's private contact number and visiting destination to subsequent guests. Digi-Gate keeps all information strictly confidential and encrypted with TLS 1.3 and AES-256 standards.
            </p>
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#172525]">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  <Check className="size-3 stroke-[3]" />
                </span>
                <span>Zero physical exposure: visitors only see their own private check-in screen</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#172525]">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  <Check className="size-3 stroke-[3]" />
                </span>
                <span>Customizable 30, 90, or 365-day automated data retention purge policies</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#172525]">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  <Check className="size-3 stroke-[3]" />
                </span>
                <span>Immutable, timestamped audit log export for security reviews and safety compliance</span>
              </div>
            </div>
          </div>

          <hr className="my-14 border-slate-200" />

          {/* Cross-Functional Team Value */}
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#05706f]">
              Departmental Value
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-[#172525]">
              Tailored benefits across your organisation
            </h2>

            <div className="mt-8 space-y-8">
              <div className="border-l-2 border-[#035352] pl-5 space-y-1.5">
                <div className="flex items-center gap-2 font-heading text-base font-bold text-[#172525]">
                  <UsersRound className="size-4 text-[#05706f]" /> Front Desk & Reception Teams
                </div>
                <p className="text-xs sm:text-sm text-[#4a5d5c] leading-relaxed">
                  Eliminates handwritten logbooks, repetitive phone dialing, and reception bottlenecks so staff can focus on guest hospitality.
                </p>
              </div>

              <div className="border-l-2 border-[#035352] pl-5 space-y-1.5">
                <div className="flex items-center gap-2 font-heading text-base font-bold text-[#172525]">
                  <ShieldCheck className="size-4 text-[#05706f]" /> Security & Facility Managers
                </div>
                <p className="text-xs sm:text-sm text-[#4a5d5c] leading-relaxed">
                  Maintains real-time building headcount, verified visitor identity with photo capture, and instant 1-tap emergency roll-call records.
                </p>
              </div>

              <div className="border-l-2 border-[#035352] pl-5 space-y-1.5">
                <div className="flex items-center gap-2 font-heading text-base font-bold text-[#172525]">
                  <Bell className="size-4 text-[#05706f]" /> Hosts & Employees
                </div>
                <p className="text-xs sm:text-sm text-[#4a5d5c] leading-relaxed">
                  Instant arrival push notifications via WhatsApp and SMS ensure meetings start promptly without lobby waiting delays.
                </p>
              </div>

              <div className="border-l-2 border-[#035352] pl-5 space-y-1.5">
                <div className="flex items-center gap-2 font-heading text-base font-bold text-[#172525]">
                  <Building2 className="size-4 text-[#05706f]" /> Executives & HR Leadership
                </div>
                <p className="text-xs sm:text-sm text-[#4a5d5c] leading-relaxed">
                  Delivers rich workplace traffic analytics, strengthens compliance with privacy laws, and requires zero proprietary hardware investments.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 rounded-3xl bg-[#035352] p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold">Ready to upgrade your visitor flow?</h2>
              <p className="mt-1 text-xs sm:text-sm text-teal-100/80">
                Setup takes under 5 minutes with zero hardware investment.
              </p>
            </div>
            <Button
              onClick={() => navigate("/register")}
              className="h-11 rounded-full bg-[#F3E8BC] hover:bg-[#e8da9d] px-7 text-xs font-bold text-[#035352] cursor-pointer shrink-0 shadow-lg"
            >
              Register Your Business <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}


