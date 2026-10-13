import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Check,
  Clock3,
  Eye,
  FileCheck2,
  PanelTop,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

const bottlenecks = [
  {
    num: "01",
    title: "Paper Registers & Physical Clipboards",
    frictionLabel: "Privacy Exposure Risk",
    friction: "Physical logbooks leave every visitor's private contact details, mobile numbers, and host names openly visible to subsequent guests standing at the front desk.",
    resolution: "Digi-Gate delivers isolated, encrypted check-in directly on each visitor's own smartphone. Personal data is never exposed to other visitors.",
    icon: FileCheck2,
  },
  {
    num: "02",
    title: "Repetitive Reception Routines & Intercom Delays",
    frictionLabel: "Lost Staff Productivity",
    friction: "Front desk staff spend hours handwriting repetitive entries, finding extension numbers, dialing desk phones, and tracking down hosts across office floors.",
    resolution: "Hosts receive an instant WhatsApp and SMS notification in under 0.4 seconds the moment their guest arrives, complete with the guest's photo and meeting purpose.",
    icon: Clock3,
  },
  {
    num: "03",
    title: "Zero Real-Time Workplace Visibility",
    frictionLabel: "Emergency Safety Blindspot",
    friction: "Facilities and security teams have no real-time way to know who is currently inside the building, which floor they are on, or when they departed during an emergency.",
    resolution: "Digi-Gate maintains an active live occupancy headcount across all gates and wings with 1-tap roll-call export during emergency evacuation drills.",
    icon: Eye,
  },
  {
    num: "04",
    title: "Disorganized Historical Records & Lost Logs",
    frictionLabel: "Compliance & Audit Failure",
    friction: "Paper binders are vulnerable to water damage, physical theft, and misplacement, making security investigations and compliance audits impossible.",
    resolution: "All visits are recorded in an immutable, timestamped cloud ledger with customizable 30/90-day automatic retention purge policies.",
    icon: PanelTop,
  },
  {
    num: "05",
    title: "Outdated Arrival Impression",
    frictionLabel: "Substandard Brand Impression",
    friction: "A messy clipboard at reception signals outdated technology to prospective clients, executive partners, and top talent.",
    resolution: "Welcome guests with a sleek, branded digital entrance pass and contactless arrival flow that reflects an innovative, forward-thinking organization.",
    icon: Building2,
  },
];

export default function WhyDigiGatePage() {
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#05706f] bg-[#e6f0f0] px-3.5 py-1 rounded-full">
              Why Digi-Gate
            </span>
            <h1 className="mt-5 font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-[#172525] leading-tight">
              Move beyond the friction of yesterday's paper registers.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#4a5d5c] leading-relaxed max-w-2xl">
              Traditional visitor management creates friction where your organisation should feel most welcoming, professional, and secure. Explore the 5 core bottlenecks solved by Digi-Gate.
            </p>
          </div>

          {/* Sequential 5-Bottleneck Breakdown (Open Narrative, No Box Grids) */}
          <div className="mt-14 space-y-12">
            {bottlenecks.map(({ num, title, frictionLabel, friction, resolution, icon: Icon }) => (
              <div key={num} className="border-t border-slate-200 pt-8 first:border-t-0 first:pt-0">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 font-mono text-xs font-extrabold text-[#05706f] bg-[#e6f0f0] px-2.5 py-0.5 rounded-full">
                    <Icon className="size-3.5" />
                    Problem {num}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    • {frictionLabel}
                  </span>
                </div>

                <h2 className="mt-3 font-heading text-xl sm:text-2xl font-extrabold text-[#172525]">
                  {title}
                </h2>

                <div className="mt-4 space-y-3">
                  <p className="text-sm sm:text-base text-[#4a5d5c] leading-relaxed">
                    <strong className="text-[#172525]">The Old Routine:</strong> {friction}
                  </p>

                  <div className="flex items-start gap-3 text-sm sm:text-base text-[#035352] font-medium pt-1">
                    <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                      <Check className="size-3 stroke-[3]" />
                    </span>
                    <span>
                      <strong className="text-[#172525]">The Digi-Gate Standard:</strong> {resolution}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modern Standard Highlights */}
          <div className="mt-16 border-t border-slate-200 pt-12">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#05706f]">
              Architectural Standard
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-[#172525]">
              How Digi-Gate transforms your entire entrance
            </h2>

            <div className="mt-8 space-y-6">
              <div className="border-l-2 border-[#035352] pl-5 space-y-1">
                <div className="flex items-center gap-2 font-heading text-base font-bold text-[#172525]">
                  <Sparkles className="size-4 text-[#05706f]" /> Contactless Mobile QR Engine
                </div>
                <p className="text-xs sm:text-sm text-[#4a5d5c] leading-relaxed">
                  Unique, dynamic session passes issued in under 18 seconds without requiring proprietary kiosks or visitor app downloads.
                </p>
              </div>

              <div className="border-l-2 border-[#035352] pl-5 space-y-1">
                <div className="flex items-center gap-2 font-heading text-base font-bold text-[#172525]">
                  <Zap className="size-4 text-[#05706f]" /> Real-Time Host Notification Webhooks
                </div>
                <p className="text-xs sm:text-sm text-[#4a5d5c] leading-relaxed">
                  Hosts receive instant push notifications via WhatsApp and SMS with 1-tap arrival acknowledgment.
                </p>
              </div>

              <div className="border-l-2 border-[#035352] pl-5 space-y-1">
                <div className="flex items-center gap-2 font-heading text-base font-bold text-[#172525]">
                  <ShieldCheck className="size-4 text-[#05706f]" /> Immutable Cloud Audit Ledger
                </div>
                <p className="text-xs sm:text-sm text-[#4a5d5c] leading-relaxed">
                  Every check-in and checkout is encrypted, timestamped, and stored with automated GDPR retention rules.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 rounded-3xl bg-[#035352] p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold">Ready to modernize your reception?</h2>
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


