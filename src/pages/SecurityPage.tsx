import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  LockKeyhole,
  Server,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

const defenseTiers = [
  {
    num: "Layer 01",
    badge: "Perimeter & Transport Security",
    title: "End-to-End TLS 1.3 Encryption & Confidential QR",
    tagline: "Total visitor privacy with zero physical logbook visibility",
    desc: "Every visitor session is encrypted in transit with TLS 1.3. Unlike paper registers where everyone can read previous visitors' private contact info and destination hosts, Digi-Gate provides completely isolated, private mobile check-in.",
    specs: [
      "TLS 1.3 in-transit encryption across all mobile check-in flows",
      "Dynamic session-based QR code issuance",
      "Zero shared public visibility between consecutive visitors",
      "Strict browser origin validation and HTTPS enforcement",
    ],
    icon: LockKeyhole,
  },
  {
    num: "Layer 02",
    badge: "Identity Verification & Anti-Fraud",
    title: "Instant Mobile OTP Authentication & Host Approvals",
    tagline: "Prevent anonymous arrivals and fake identity entries",
    desc: "Visitors verify their mobile number with an instantaneous SMS OTP token. The auto-lookup directory routes the check-in immediately to the host for one-tap authorization before access is permitted.",
    specs: [
      "Real-time SMS OTP phone number verification",
      "Auto-complete host directory search to eliminate misrouted visits",
      "Host one-tap WhatsApp and SMS approval workflow",
      "Optional front-camera selfie identity capture for badge verification",
    ],
    icon: UserCheck,
  },
  {
    num: "Layer 03",
    badge: "Data Privacy & Governance",
    title: "AES-256 Storage & Automated Retention Purging",
    tagline: "GDPR aligned retention controls and immutable audit trails",
    desc: "All historical visit records are encrypted at rest with AES-256. Automated retention policies purge sensitive visitor personal data after 30, 90, or 365 days to maintain strict compliance with global privacy regulations.",
    specs: [
      "AES-256 encrypted cloud database at rest",
      "Customizable 30 / 90 / 365 day auto-purge intervals",
      "GDPR and regional data privacy regulation alignment",
      "SOC 2 Type II certified cloud hosting infrastructure",
    ],
    icon: Server,
  },
  {
    num: "Layer 04",
    badge: "Access Control & Evacuation Safety",
    title: "Role-Based Access & 1-Tap Emergency Headcount",
    tagline: "Granular administrative privileges and evacuation safety",
    desc: "Security officers, receptionists, hosts, and executive auditors receive tailored permission tiers. In the event of a fire drill or incident, safety marshals generate an instant live headcount across all zones.",
    specs: [
      "Role-Based Access Control (RBAC) across reception and security staff",
      "1-tap live emergency evacuation headcount export",
      "Multi-gate and turnstile hardware barcode integration",
      "Immutable timestamped audit logs for incident investigation",
    ],
    icon: ShieldAlert,
  },
];

const complianceStandards = [
  "SOC 2 Type II Infrastructure",
  "GDPR & Data Privacy Aligned",
  "TLS 1.3 In-Flight Encryption",
  "AES-256 Rest Encryption",
  "99.9% High Availability SLA",
  "Automated Incident Audit Ledger",
];

export default function SecurityPage() {
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#05706f] bg-[#e6f0f0] px-3.5 py-1 rounded-full">
              Trust & Security
            </span>
            <h1 className="mt-5 font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-[#172525] leading-tight">
              Enterprise security with zero privacy compromises.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#4a5d5c] leading-relaxed max-w-2xl">
              Digi-Gate is built from the ground up to protect visitor privacy, enforce perimeter access control, and provide immutable audit trails for enterprise workplace security.
            </p>

            {/* Compliance Badges */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {complianceStandards.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200/80"
                >
                  <Check className="size-3.5 text-emerald-600 stroke-[3]" />
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Sequential 4-Tier Defense Stack (Open Narrative, No Box Grids) */}
          <div className="mt-14 space-y-12">
            {defenseTiers.map(({ num, badge, title, tagline, desc, specs, icon: Icon }) => (
              <div key={num} className="border-t border-slate-200 pt-8 first:border-t-0 first:pt-0">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-[#e6f0f0] text-[#035352]">
                    <Icon className="size-4" />
                  </span>
                  <span className="font-mono text-xs font-bold text-[#05706f] uppercase tracking-wider">
                    {num} • {badge}
                  </span>
                </div>

                <h2 className="mt-3 font-heading text-xl sm:text-2xl font-extrabold text-[#172525]">
                  {title}
                </h2>
                <p className="text-sm font-semibold text-[#035352] mt-0.5">
                  — {tagline}
                </p>

                <p className="mt-3 text-sm sm:text-base text-[#4a5d5c] leading-relaxed">
                  {desc}
                </p>

                <div className="mt-4 space-y-2">
                  {specs.map((spec) => (
                    <div key={spec} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#172525]">
                      <span className="flex size-4.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                        <Check className="size-3 stroke-[3]" />
                      </span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Security Comparison Table */}
          <div className="mt-16 border-t border-slate-200 pt-12">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#05706f]">
              Security Matrix
            </span>
            <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-[#172525]">
              Physical Logbooks vs. Digi-Gate Cloud Platform
            </h2>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                    <th className="pb-3 pr-4">Security Criterion</th>
                    <th className="pb-3 px-4 text-rose-700">Traditional Paper Register</th>
                    <th className="pb-3 pl-4 text-[#035352]">Digi-Gate Cloud Platform</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#4a5d5c]">
                  <tr>
                    <td className="py-3.5 pr-4 font-bold text-[#172525]">Data Privacy & Confidentiality</td>
                    <td className="py-3.5 px-4 text-rose-600">❌ Open to everyone standing at reception</td>
                    <td className="py-3.5 pl-4 font-bold text-emerald-700">✅ 100% Encrypted & Private</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 font-bold text-[#172525]">Identity Verification</td>
                    <td className="py-3.5 px-4 text-rose-600">❌ False names and illegible handwriting</td>
                    <td className="py-3.5 pl-4 font-bold text-emerald-700">✅ Verified OTP & Photo Capture</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 font-bold text-[#172525]">Live Emergency Headcount</td>
                    <td className="py-3.5 px-4 text-rose-600">❌ Impossible to track</td>
                    <td className="py-3.5 pl-4 font-bold text-emerald-700">✅ Instant 1-Tap Active Roster</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 font-bold text-[#172525]">Compliance & Audit Records</td>
                    <td className="py-3.5 px-4 text-rose-600">❌ Prone to physical loss and damage</td>
                    <td className="py-3.5 pl-4 font-bold text-emerald-700">✅ Immutable Timestamped Cloud Logs</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 pr-4 font-bold text-[#172525]">Data Retention & Purging</td>
                    <td className="py-3.5 px-4 text-rose-600">❌ Indefinite paper clutter</td>
                    <td className="py-3.5 pl-4 font-bold text-emerald-700">✅ Automated 30/90-Day Retention Rules</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 rounded-3xl bg-[#022928] p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">Protect your workplace today</h2>
              <p className="mt-1 text-xs sm:text-sm text-teal-100/80">
                Join forward-thinking organisations securing their visitor entrance with Digi-Gate.
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


