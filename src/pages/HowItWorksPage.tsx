import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

const detailedSteps = [
  {
    step: "01",
    label: "Stage 01 • Guest Arrival",
    title: "Instant QR scan with zero app install.",
    desc: "Visitors arrive at your building, lobby, or security turnstile and scan your Digi-Gate QR code with their standard mobile camera. A sleek, mobile-optimized check-in interface opens in their browser immediately.",
    highlights: [
      "Zero app installation required on any device",
      "Dynamic entrance QR code with gate-specific attribution",
      "Instant browser launch in less than 2 seconds",
    ],
  },
  {
    step: "02",
    label: "Stage 02 • Verified Identity",
    title: "Fast OTP verification and host selection.",
    desc: "Guests fill in their name, mobile phone, and destination host from an auto-complete directory. Purpose of visit is recorded and verified via instant SMS / WhatsApp OTP.",
    highlights: [
      "One-time password (OTP) verification prevents fake entries",
      "Smart host search automatically suggests staff & departments",
      "Optional photo capture & vehicle plate logging",
    ],
  },
  {
    step: "03",
    label: "Stage 03 • Host Notification",
    title: "Real-time dispatch across WhatsApp and SMS.",
    desc: "The host receives an immediate notification the instant their guest completes registration, complete with visitor photo and meeting context. Hosts can acknowledge with a single tap.",
    highlights: [
      "Sub-second alert dispatch via WhatsApp and SMS",
      "One-tap acknowledgment so guests know their host is coming",
      "Eliminates front-desk intercom delays and missed meetings",
    ],
  },
  {
    step: "04",
    label: "Stage 04 • Pass Issuance & Live Control",
    title: "Branded digital gate pass and security roster.",
    desc: "Visitors receive a verified digital pass on their phone ready for security checkpoints. Front desk and security teams maintain a live, synchronized roster of all on-site personnel.",
    highlights: [
      "Tamper-resistant digital badge with dynamic security timestamp",
      "Live occupant count for facility management and emergency readiness",
      "One-click contactless checkout when leaving premises",
    ],
  },
];

export default function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#05706f] bg-[#e6f0f0] px-3.5 py-1 rounded-full">
              Process & Flow
            </span>
            <h1 className="mt-5 font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-[#172525] leading-tight">
              Simple for your guests. Effortless for your team.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#4a5d5c] leading-relaxed max-w-2xl">
              Digi-Gate streamlines the entire visitor journey from arrival to checkout in 4 connected, automated stages.
            </p>
          </div>

          {/* Connected Step-by-Step Flow (Open Editorial Timeline) */}
          <div className="mt-14 space-y-12">
            {detailedSteps.map(({ step, label, title, desc, highlights }, index) => (
              <div key={step}>
                {index > 0 && <hr className="mb-12 border-slate-200" />}

                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 text-[#05706f] font-mono text-xs font-bold uppercase tracking-wider">
                    <span className="flex size-6 items-center justify-center rounded-full bg-[#035352] text-[#F3E8BC] text-[10px] font-extrabold">
                      {step}
                    </span>
                    <span>{label}</span>
                  </div>

                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#172525]">
                    {title}
                  </h2>

                  <p className="text-sm sm:text-base text-[#4a5d5c] leading-relaxed">
                    {desc}
                  </p>

                  <div className="pt-2 space-y-2.5">
                    {highlights.map((item) => (
                      <div key={item} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#172525]">
                        <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                          <Check className="size-3 stroke-[3]" />
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-14 border-slate-200" />

          {/* Architecture Highlights (Open Narrative) */}
          <div className="space-y-6">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#05706f] bg-[#e6f0f0] px-3.5 py-1 rounded-full">
              Enterprise Foundations
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#172525]">
              Built for speed, privacy, and frictionless adoption.
            </h2>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 text-xs sm:text-sm text-[#4a5d5c]">
                <span className="flex size-6 items-center justify-center rounded-full bg-[#e6f0f0] text-[#035352] shrink-0 font-bold">
                  ✓
                </span>
                <div>
                  <strong className="text-[#172525]">Zero Hardware Footprint: </strong>
                  No tablets or kiosk printers required. Simply print your Digi-Gate QR code poster and start welcoming visitors immediately.
                </div>
              </div>
              <div className="flex items-start gap-3.5 text-xs sm:text-sm text-[#4a5d5c]">
                <span className="flex size-6 items-center justify-center rounded-full bg-[#e6f0f0] text-[#035352] shrink-0 font-bold">
                  ✓
                </span>
                <div>
                  <strong className="text-[#172525]">Multi-Tenant & Multi-Gate Support: </strong>
                  Manage different entrances, towers, and sub-companies from a unified administrative console.
                </div>
              </div>
              <div className="flex items-start gap-3.5 text-xs sm:text-sm text-[#4a5d5c]">
                <span className="flex size-6 items-center justify-center rounded-full bg-[#e6f0f0] text-[#035352] shrink-0 font-bold">
                  ✓
                </span>
                <div>
                  <strong className="text-[#172525]">Automated Data Retention & GDPR Compliance: </strong>
                  Visitor logs are encrypted with AES-256 and automatically purged according to your organization's data policies.
                </div>
              </div>
            </div>
          </div>

          <hr className="my-14 border-slate-200" />

          {/* Bottom Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-xl font-bold text-[#172525]">
                Ready to upgrade your visitor flow?
              </h3>
              <p className="text-xs sm:text-sm text-[#4a5d5c] mt-1">
                Register your business in 5 minutes and deploy today.
              </p>
            </div>
            <Button
              onClick={() => navigate("/register")}
              size="lg"
              className="rounded-full bg-[#035352] hover:bg-[#023e3d] text-white px-8 font-bold text-sm shadow-lg shadow-[#035352]/20 flex items-center gap-2 cursor-pointer"
            >
              Register Your Business <ArrowRight className="size-4 text-[#F3E8BC]" />
            </Button>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
