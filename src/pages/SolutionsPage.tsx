import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Check,
  Globe2,
  GraduationCap,
  Headphones,
  Hotel,
  LockKeyhole,
  Network,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

const sectors = [
  {
    icon: Building2,
    badge: "Enterprise",
    title: "Corporate Workplaces & Executive HQs",
    tagline: "Deliver an executive VIP arrival experience",
    desc: "Make every arrival feel as considered as the workplace itself. Eliminate lobby congestion for visiting clients, board members, candidates, and vendor teams with automated calendar invites and instant host alerts.",
    features: [
      "VIP pre-registration with calendar invite sync",
      "Instant WhatsApp & SMS host arrival notifications",
      "Custom digital NDA & safety policy sign-off",
      "Executive meeting room routing & wayfinding",
    ],
  },
  {
    icon: Network,
    badge: "Commercial Real Estate",
    title: "Multi-Tenant Tech & Business Parks",
    tagline: "Centralized security with isolated company directories",
    desc: "Manage thousands of daily visitor arrivals across shared business park lobbies and multiple office towers. Central security leads maintain global perimeter control while tenant companies manage their individual guests.",
    features: [
      "Multi-tenant company search with auto-complete directory",
      "Turnstile & speed-gate QR scanner integration",
      "Consolidated multi-tower security logbook",
      "Tenant company branding on guest passes",
    ],
  },
  {
    icon: GraduationCap,
    badge: "Education",
    title: "Educational Campuses & Universities",
    tagline: "Protect students and maintain welcoming campus grounds",
    desc: "Ensure comprehensive campus perimeter security by issuing verified digital gate passes to visiting parents, contractors, visiting alumni, and guest lecturers.",
    features: [
      "Parent & vendor photo and OTP verification",
      "Department and building-specific zone routing",
      "Emergency roll call and campus evacuation roster",
      "Automated time-bounded curfew passes",
    ],
  },
  {
    icon: ShieldCheck,
    badge: "Industrial & Logistics",
    title: "Industrial, Manufacturing & Logistics",
    tagline: "Enforce safety compliance before site entry",
    desc: "Strictly enforce OSHA/safety compliance, PPE checklists, and vehicle license plate logging before visitors or logistics contractors enter operational facility zones.",
    features: [
      "Mandatory safety video and PPE acknowledgment",
      "Contractor time-in / time-out tracking",
      "Delivery truck & driver license logging",
      "Hazardous zone permission approvals",
    ],
  },
  {
    icon: Globe2,
    badge: "Flexible Spaces",
    title: "Co-Working & Innovation Hubs",
    tagline: "24/7 self-service arrival for community members",
    desc: "Empower flexible workspaces and incubator hubs to welcome guests smoothly without requiring full-time reception staff at every single entrance.",
    features: [
      "Frictionless QR self-check-in at lobby pedestals",
      "Direct member notification via Slack & WhatsApp webhooks",
      "Flexible guest day-pass issuance",
      "Community room booking verification",
    ],
  },
  {
    icon: Headphones,
    badge: "Healthcare",
    title: "Healthcare Clinics & Hospitals",
    tagline: "Calm, confidential, and orderly patient arrival",
    desc: "Maintain strict HIPAA / patient confidentiality while guiding visitors, medical specialists, and equipment technicians to their designated clinic departments.",
    features: [
      "100% confidential check-in with zero public logs",
      "Departmental priority triage & host dispatch",
      "Visiting hour enforcement & visitor limits",
      "Sanitization and health screening checklist",
    ],
  },
  {
    icon: Hotel,
    badge: "Events & Hospitality",
    title: "Hospitality & Event Venues",
    tagline: "High-throughput check-in for summits and galas",
    desc: "Handle hundreds of conference attendees arriving at once with high-speed contactless gate passes and live venue capacity analytics.",
    features: [
      "Bulk email QR pass distribution",
      "Express 2-second turnstile barcode validation",
      "Live hall capacity & occupancy tracking",
      "VIP delegate lounge access permissions",
    ],
  },
  {
    icon: LockKeyhole,
    badge: "Residential",
    title: "Gated Communities & Residential Towers",
    tagline: "Peace of mind for residents and security guards",
    desc: "Give apartment residents instant mobile authorization when couriers, maids, maintenance technicians, or personal guests arrive at the main security boom gate.",
    features: [
      "Instant resident approval notification on mobile",
      "Delivery & service vendor digital gate pass",
      "Frequent visitor auto-verification profile",
      "Security guard intercom replacement",
    ],
  },
];

export default function SolutionsPage() {
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#05706f] bg-[#e6f0f0] px-3.5 py-1 rounded-full">
              Industry Solutions
            </span>
            <h1 className="mt-5 font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-[#172525] leading-tight">
              Engineered for the unique demands of your industry.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#4a5d5c] leading-relaxed max-w-2xl">
              Wherever guests, clients, contractors, or visitors arrive, Digi-Gate provides specialized workflows tailored to your sector's security and operational needs.
            </p>
          </div>

          {/* Sequential Sector Breakdown (Open Narrative, No Box Grids) */}
          <div className="mt-14 space-y-12">
            {sectors.map(({ icon: Icon, badge, title, tagline, desc, features }) => (
              <div key={title} className="border-t border-slate-200 pt-8 first:border-t-0 first:pt-0">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-[#e6f0f0] text-[#035352]">
                    <Icon className="size-4" />
                  </span>
                  <span className="font-mono text-xs font-bold text-[#05706f] uppercase tracking-wider">
                    {badge}
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
                  {features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#172525]">
                      <span className="flex size-4.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                        <Check className="size-3 stroke-[3]" />
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 rounded-3xl bg-[#035352] p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold">Have custom workplace requirements?</h2>
              <p className="mt-1 text-xs sm:text-sm text-teal-100/80">
                Digi-Gate configures to any organisation size or layout within minutes.
              </p>
            </div>
            <Button
              onClick={() => navigate("/register")}
              className="h-11 rounded-full bg-[#F3E8BC] hover:bg-[#e8da9d] px-7 text-xs font-bold text-[#035352] cursor-pointer shrink-0 shadow-lg"
            >
              Get Started Now <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}


