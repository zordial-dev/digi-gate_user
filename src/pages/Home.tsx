import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  FileCheck2,
  Globe2,
  Headphones,
  LockKeyhole,
  MonitorSmartphone,
  Network,
  PanelTop,
  QrCode,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { LogoMark } from "@/components/layout/MarketingHeader";

type IconComponent = any;

const problemCards: { title: string; copy: string; icon: IconComponent }[] = [
  { title: "Paper registers", copy: "Paper records and repetitive entry procedures create friction at the point of arrival.", icon: FileCheck2 },
  { title: "Manual processes", copy: "Reception and security teams spend time handling routine visitor entries by hand.", icon: Clock3 },
  { title: "Poor visibility", copy: "It can be difficult to quickly understand who is visiting and why.", icon: Eye },
  { title: "Difficult records", copy: "Visitor and visit information becomes harder to organise, manage and review.", icon: PanelTop },
  { title: "Unprofessional experience", copy: "A manual reception process does not reflect a modern organisation.", icon: Building2 },
];

const benefits: { title: string; copy: string; icon: IconComponent; featured?: boolean }[] = [
  { title: "Better visitor experience", copy: "Give every guest a smoother, more modern arrival experience.", icon: Sparkles },
  { title: "Organised visitor records", copy: "Keep visitor and visit information structured and easier to manage.", icon: FileCheck2 },
  { title: "Faster reception operations", copy: "Reduce repetitive manual processes and make visitor handling more efficient.", icon: Zap },
  { title: "Better host awareness", copy: "Help hosts and relevant teams stay more aware when visitors arrive.", icon: Bell },
  { title: "Management oversight", copy: "Give management a clearer view of visitor activity and workplace operations.", icon: Eye, featured: true },
  { title: "Professional workplace experience", copy: "Create a considered, consistent experience from the moment a visitor arrives.", icon: Building2 },
  { title: "Scalable organisational solution", copy: "Support organisations as their visitor-management needs grow and change.", icon: Globe2 },
  { title: "A modern digital system", copy: "Move from manual processes toward a more organised digital visitor experience.", icon: MonitorSmartphone },
];

const useCases: { title: string; copy: string; icon: IconComponent; wide?: boolean }[] = [
  { title: "Corporate offices", copy: "Make every arrival feel as considered as the workplace itself.", icon: Building2, wide: true },
  { title: "Business parks", copy: "Bring clarity to a multi-organisation visitor environment.", icon: Network },
  { title: "Educational institutions", copy: "Create a welcoming, organised experience for every guest.", icon: UsersRound },
  { title: "Industrial facilities", copy: "Keep visitor activity structured across operational sites.", icon: ShieldCheck, wide: true },
  { title: "Co-working spaces", copy: "Give members and their visitors a polished shared experience.", icon: Globe2 },
  { title: "Large campuses", copy: "Support a consistent visitor journey across every building.", icon: PanelTop },
  { title: "Healthcare organisations", copy: "Create a calmer, more professional point of arrival.", icon: Headphones },
  { title: "Residential communities", copy: "Make visitor experiences feel clear, friendly and organised.", icon: LockKeyhole },
];

const faqs = [
  ["What is Digi-Gate?", "Digi-Gate is a modern digital visitor-management solution that helps organisations create a faster, more organised and professional experience for every guest."],
  ["Who is Digi-Gate designed for?", "It is designed for offices, companies, institutions, business parks, campuses and other organisations that welcome and manage visitors."],
  ["What problems does Digi-Gate solve?", "Digi-Gate helps organisations move beyond paper registers and manual processes, organise visitor information, improve visibility and make visitor management more efficient."],
  ["How can it improve visitor management?", "By bringing visitor and visit information into a more organised digital system, Digi-Gate helps teams create a clearer experience for visitors, hosts and management."],
  ["Can it support different types of organisations?", "Digi-Gate is designed for organisations of different types and sizes, including workplaces, institutions, business parks and other visitor-facing environments."],
  ["How can an organisation get started?", "Request a demo or use our gate QR scanner to check into your destination organisation immediately."],
] as const;

const howSteps: { step: string; title: string; copy: string; icon: IconComponent }[] = [
  { step: "01", title: "Visitor arrives", copy: "A visitor arrives at your organisation and is welcomed into a clear, professional experience.", icon: UsersRound },
  { step: "02", title: "Information is managed digitally", copy: "Visitor and visit information is brought into a more organised digital system.", icon: MonitorSmartphone },
  { step: "03", title: "Relevant teams stay informed", copy: "Hosts and relevant teams have the information they need to manage the visit efficiently.", icon: Bell },
  { step: "04", title: "Your organisation has better oversight", copy: "Management and teams have a clearer view of visitor activity and workplace operations.", icon: Eye },
];

function Reveal({
  children,
  className = "",
  delay = 0,
  y = 25,
  duration = 0.5,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

  return (
    <div ref={ref} className={`h-full ${className}`}>
      <motion.div
        className="h-full flex flex-col gpu-layer"
        initial={{ opacity: 0, y }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
        transition={{ duration, delay: isInView ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function SectionIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  const id = eyebrow.toLowerCase().replaceAll(" ", "-");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });

  return (
    <div ref={ref} className="max-w-2xl gpu-layer">
      <motion.p
        className="eyebrow"
        data-testid={`section-eyebrow-${id}`}
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="mt-2.5 sm:mt-3.5 font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight text-[#172525]"
        data-testid={`section-heading-${id}`}
        initial={{ opacity: 0, y: 18 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.45, delay: isInView ? 0.05 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h2>
      {copy && (
        <motion.p
          className="mt-2.5 sm:mt-3.5 max-w-2xl text-xs sm:text-sm sm:leading-relaxed text-[#4a5d5c]"
          data-testid={`section-copy-${id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.45, delay: isInView ? 0.1 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          {copy}
        </motion.p>
      )}
    </div>
  );
}

function ConceptualArrivalVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] pt-2 pb-6" data-testid="hero-conceptual-visual">
      {/* Background Glows */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-[#035352]/20 via-[#05706f]/15 to-[#F3E8BC]/25 blur-3xl -z-10" />

      {/* Main Terminal Frame */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-b from-[#023e3d] via-[#035352] to-[#012524] p-5 sm:p-6 shadow-[0_20px_50px_-15px_rgba(3,83,82,0.35)]">

        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-300">Gate 01 • Active Terminal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[9px] font-semibold text-[#F3E8BC] tracking-wide">
              🔒 Encrypted
            </span>
            <span className="flex size-7 items-center justify-center rounded-lg bg-white/10 text-[#F3E8BC]">
              <Bell className="size-3.5" />
            </span>
          </div>
        </div>

        {/* Live Visitor Digital Pass Card */}
        <div className="mt-4 rounded-2xl border border-white/15 bg-white p-5 shadow-2xl text-[#172525]">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#035352] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#F3E8BC]">
                  Digital Pass
                </span>
                <span className="font-mono text-[10px] font-bold text-slate-400">#DG-84920</span>
              </div>
              <p className="mt-1.5 text-xs font-semibold text-slate-500">Issued at Main Reception</p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#e6f0f0] text-[#035352] font-bold text-xs shadow-inner">
              <Sparkles className="size-4 text-[#05706f]" />
            </div>
          </div>

          {/* Visitor Bio */}
          <div className="mt-4 flex items-center gap-3.5">
            <div className="relative">
              <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#035352] to-[#05706f] text-sm font-extrabold text-[#F3E8BC] ring-2 ring-emerald-500/30">
                AW
              </div>
              <span className="absolute bottom-0 right-0 flex size-3.5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                <Check className="size-2.5 stroke-[3]" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-heading text-sm font-bold text-[#172525]">Alexander Wright</h4>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">Verified</span>
              </div>
              <p className="text-xs text-slate-500">VP of Operations • Acme Corp</p>
            </div>
          </div>

          {/* Grid Info */}
          <div className="mt-4 grid grid-cols-2 gap-2.5 rounded-xl bg-[#F4F7F6] p-3 text-xs">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Host Staff</span>
              <span className="font-bold text-[#035352] truncate block mt-0.5">Elena Rostova</span>
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Location</span>
              <span className="font-bold text-[#172525] truncate block mt-0.5">Floor 4, Suite 402</span>
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Visit Purpose</span>
              <span className="font-semibold text-slate-700 truncate block mt-0.5">Strategy Review</span>
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Valid Until</span>
              <span className="font-semibold text-slate-700 truncate block mt-0.5">Today, 6:00 PM</span>
            </div>
          </div>

          {/* Pass Scan Status */}
          <div className="mt-3.5 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/70 px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <QrCode className="size-5 text-[#035352]" />
              <div>
                <p className="text-[11px] font-bold text-[#035352]">Gate QR Pass Active</p>
                <p className="text-[9px] text-emerald-700">Access granted for Turnstile B</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-sm">
              Approved
            </span>
          </div>
        </div>

        {/* Console Bottom Status */}
        <div className="mt-3 flex items-center justify-between text-[10px] text-teal-100/70 px-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-[#F3E8BC]" /> Host Notification Dispatched
          </span>
          <span className="font-mono text-[#F3E8BC]/90">0.4s sync</span>
        </div>
      </div>

      {/* Floating Notification Cards */}
      <motion.div
        className="absolute -left-4 top-10 hidden sm:flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl shadow-[#035352]/10 backdrop-blur-xl z-20"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        data-testid="hero-floating-arrival-card"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-[#e6f0f0] text-[#035352] shadow-inner">
          <Bell className="size-4 text-[#035352]" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-bold text-[#035352]">Host Alert Sent</p>
            <span className="text-[9px] text-slate-400">Just now</span>
          </div>
          <p className="text-xs font-medium text-slate-600">Elena R. acknowledged arrival</p>
        </div>
      </motion.div>

      <motion.div
        className="absolute -right-4 -bottom-1 hidden sm:flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl shadow-[#035352]/10 backdrop-blur-xl z-20"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        data-testid="hero-floating-oversight-card"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-inner">
          <ShieldCheck className="size-4" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-bold text-emerald-800">Gate Pass Ready</p>
            <span className="size-1.5 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xs font-semibold text-[#172525]">Contactless Entry Approved</p>
        </div>
      </motion.div>
    </div>
  );
}

function ConceptualProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl" data-testid="product-preview-visual">
      <div className="rounded-[2rem] border border-slate-200/80 bg-white p-3 shadow-2xl shadow-[#035352]/10 sm:p-5">
        <div className="overflow-hidden rounded-[1.25rem] border border-slate-100 bg-[#F4F7F6]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-5 py-3.5">
            <div className="flex items-center gap-3">
              <LogoMark testId="product-preview-brand-mark" />
              <span className="hidden border-l border-slate-200 pl-3 text-xs font-bold text-[#4a5d5c] sm:inline">
                Live Reception & Security Console
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                28 On-Site
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left: Recent Activity Feed */}
            <div className="rounded-xl border border-slate-200/70 bg-white p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <p className="text-xs font-bold text-[#035352]">Recent Visitor Arrivals</p>
                <span className="font-mono text-[9px] font-semibold text-slate-400">Real-time</span>
              </div>
              <div className="mt-3 space-y-2.5">
                {[
                  { name: "Alexander Wright", company: "Acme Corp", host: "Elena R.", time: "10:14 AM", status: "Checked In", badgeColor: "bg-emerald-50 text-emerald-700" },
                  { name: "Sarah Jenkins", company: "Nexus Design", host: "David K.", time: "10:28 AM", status: "Pass Issued", badgeColor: "bg-[#e6f0f0] text-[#035352]" },
                  { name: "Michael Chen", company: "Apex Cloud", host: "Priya S.", time: "10:35 AM", status: "Notified", badgeColor: "bg-amber-50 text-amber-700" },
                ].map((v) => (
                  <div key={v.name} className="flex items-center justify-between rounded-lg bg-[#F4F7F6] p-2.5 text-xs">
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-[#172525] truncate">{v.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{v.company} • Host: {v.host}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-bold ${v.badgeColor}`}>{v.status}</span>
                      <p className="text-[9px] text-slate-400 mt-0.5">{v.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live Traffic Stats */}
            <div className="flex flex-col justify-between rounded-xl border border-slate-200/70 bg-white p-4">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-[#035352]">Daily Traffic</p>
                  <span className="font-mono text-[9px] font-bold text-emerald-600">+18% today</span>
                </div>
                <div className="mt-4 flex h-24 items-end gap-2 border-b border-slate-100 pb-2">
                  {[25, 45, 80, 100, 65, 85, 40].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-[#035352] to-[#05706f]"
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                    />
                  ))}
                </div>
                <div className="mt-1 flex justify-between font-mono text-[8px] text-slate-400 px-1">
                  <span>9AM</span>
                  <span>11AM</span>
                  <span>1PM</span>
                  <span>3PM</span>
                  <span>5PM</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div className="rounded-lg bg-[#e6f0f0]/60 p-2 text-center">
                  <span className="text-[9px] font-semibold text-[#4a5d5c] block">Avg Entry Time</span>
                  <span className="font-heading text-xs font-extrabold text-[#035352]">18 secs</span>
                </div>
                <div className="rounded-lg bg-emerald-50/70 p-2 text-center">
                  <span className="text-[9px] font-semibold text-emerald-800 block">Host Response</span>
                  <span className="font-heading text-xs font-extrabold text-emerald-700">98.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 -left-4 hidden sm:block rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl shadow-[#035352]/10" data-testid="product-preview-concept-label">
        <p className="font-mono text-[9px] uppercase tracking-widest text-[#05706f] font-bold">Digi-Gate Platform</p>
        <p className="mt-0.5 text-xs font-extrabold text-[#035352]">Streamlined Workplace Arrival</p>
      </div>
    </div>
  );
}

function SolutionsSwiper() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % useCases.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const current = useCases[currentIndex];
  const CurrentIcon = current.icon;

  return (
    <div
      className="relative mt-6 mx-auto max-w-4xl w-full"
      data-testid="solutions-swiper"
    >
      {/* Featured Swiping Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-[#035352]/[0.08]">
        <div className="min-h-[160px] sm:min-h-[140px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 70, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -70, scale: 0.98 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#05706f] bg-[#e6f0f0] px-3 py-1 rounded-full">
                    Sector 0{currentIndex + 1} / 0{useCases.length}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#4a5d5c]">
                    Customized Architecture
                  </span>
                </div>

                <h3 className="mt-4 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172525]">
                  {current.title}
                </h3>
                <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#4a5d5c] max-w-xl">
                  {current.copy}
                </p>
              </div>

              <div className="flex size-18 sm:size-22 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#023e3d] to-[#035352] text-[#F3E8BC] shadow-xl shadow-[#035352]/25 ring-6 sm:ring-8 ring-[#e6f0f0]">
                <CurrentIcon className="size-8 sm:size-10 stroke-[1.75]" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SolutionInteractiveFlow() {
  const [activeTab, setActiveTab] = useState(0);

  const pillars = [
    {
      id: "simpler",
      num: "01",
      badge: "Simpler Operations",
      title: "Less manual work.",
      tagline: "Zero paper registers. Zero reception friction.",
      copy: "Replace handwritten logbooks with automated contactless QR check-ins. Visitors complete arrival details in under 20 seconds with zero app installation.",
      icon: Zap,
      metric: "18s",
      metricLabel: "Avg entry time",
      features: [
        "Instant smartphone browser launch with zero app install",
        "Automated OTP verification prevents fake log entries",
        "Smart auto-complete host directory to pick employees effortlessly",
      ],
    },
    {
      id: "smarter",
      num: "02",
      badge: "Smarter Visibility",
      title: "A clearer view.",
      tagline: "Total oversight of daily visitor flow.",
      copy: "Hosts receive instant alerts via WhatsApp and SMS the moment their guest checks in. Management maintains a live view of campus occupancy.",
      icon: Eye,
      metric: "0.4s",
      metricLabel: "Host alert dispatch",
      features: [
        "Sub-second multi-channel notifications via WhatsApp and SMS",
        "One-tap host acknowledgment keeps visitors informed in real time",
        "Live on-site occupancy roster for facility safety and evacuation drills",
      ],
    },
    {
      id: "professional",
      num: "03",
      badge: "More Professional",
      title: "A better welcome.",
      tagline: "A modern impression from minute one.",
      copy: "Deliver a polished arrival experience with customized digital badges, clear directions, and secure credentials tailored to your workplace.",
      icon: Sparkles,
      metric: "100%",
      metricLabel: "Visitor privacy protection",
      features: [
        "Branded digital gate pass with dynamic security verification timestamps",
        "Complete visitor data confidentiality with TLS 1.3 encryption",
        "Automated GDPR-compliant data retention and purge schedules",
      ],
    },
  ];

  const current = pillars[activeTab];

  return (
    <div className="mt-8" data-testid="solution-interactive-showcase">
      {/* Horizontal Pill Selector */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-slate-200 pb-4">
        {pillars.map((pillar, index) => {
          const isActive = activeTab === index;
          const Icon = pillar.icon;
          return (
            <button
              key={pillar.id}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#035352] text-white shadow-md shadow-[#035352]/20"
                  : "bg-white text-[#4a5d5c] hover:text-[#172525] border border-slate-200/80 hover:border-[#035352]/30"
              }`}
            >
              <Icon className="size-3.5" />
              <span>{pillar.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Active Content - Open Editorial Presentation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="mt-6 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#05706f]">
                {current.num} • {current.tagline}
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#172525] mt-1">
                {current.title}
              </h3>
            </div>
            <div className="flex items-center gap-3 border-l-2 border-[#035352] pl-4">
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-extrabold text-[#035352]">
                  {current.metric}
                </p>
                <p className="text-[11px] font-semibold text-[#4a5d5c]">
                  {current.metricLabel}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#4a5d5c] leading-relaxed max-w-3xl">
            {current.copy}
          </p>

          <div className="pt-2 space-y-2.5 max-w-2xl">
            {current.features.map((feat) => (
              <div key={feat} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-[#172525]">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  <Check className="size-3 stroke-[3]" />
                </span>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <MarketingLayout>
      <div className="w-full" data-testid="digi-gate-marketing-site">
        <section className="relative isolate overflow-hidden bg-[#F4F7F6] pt-12 sm:pt-16 lg:pt-20" data-testid="hero-section">
          {/* Subtle modern mesh ambient lights */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_14%,rgba(5,112,111,.14),transparent_35%),radial-gradient(circle_at_12%_25%,rgba(3,83,82,.08),transparent_30%)]" />

          <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 pb-6 sm:px-6 sm:pb-8 lg:grid-cols-[1fr_1fr] lg:gap-10 lg:px-8 lg:pb-10">
            <Reveal className="relative z-10 max-w-2xl">
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-[3.8rem] font-extrabold leading-[1.18] sm:leading-[1.1] tracking-tight text-[#172525]" data-testid="hero-headline">
                A smarter way to manage <span className="bg-gradient-to-r from-[#035352] via-[#05706f] to-[#023e3d] bg-clip-text text-transparent underline decoration-[#F3E8BC] decoration-4 underline-offset-8">every visitor</span>.
              </h1>

              <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[#4a5d5c]" data-testid="hero-supporting-text">
                Digi-Gate replaces traditional paper registers with contactless QR check-ins, instant host alerts, and verified digital gate passes for modern organisations.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row" data-testid="hero-cta-group">
                <Button onClick={() => navigate("/register")} size="lg" className="h-12 rounded-full bg-[#035352] hover:bg-[#023e3d] px-8 text-sm font-bold text-white shadow-lg shadow-[#035352]/20 hover:-translate-y-0.5 flex items-center justify-center gap-2.5 transition-all cursor-pointer" data-testid="hero-cta-register-business">
                  <Building2 className="size-4 text-[#F3E8BC]" /> Register Business
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-[#4a5d5c]" data-testid="hero-trust-line">
                <span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-emerald-600" /> Enterprise-grade security</span>
                <span className="size-1 rounded-full bg-[#05706f]" />
                <span className="flex items-center gap-1.5"><Zap className="size-3.5 text-amber-500" /> Instant host notification</span>
                <span className="size-1 rounded-full bg-[#05706f]" />
                <span className="flex items-center gap-1.5"><Sparkles className="size-3.5 text-[#05706f]" /> Contactless QR entry</span>
              </div>
            </Reveal>

            <Reveal className="relative" delay={0.15}>
              <ConceptualArrivalVisual />
            </Reveal>
          </div>

          <div className="border-y border-slate-200 bg-white/80" data-testid="hero-trust-strip">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a5d5c]">Trusted for modern workplace arrivals & security</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs font-semibold text-[#4a5d5c]/80">
                <span>Corporate Workplaces</span>
                <span>Tech Parks</span>
                <span>Educational Campuses</span>
                <span>Healthcare Facilities</span>
              </div>
            </div>
          </div>
        </section>

        <section id="why-digi-gate" className="scroll-mt-20 sm:scroll-mt-24 bg-white py-6 sm:py-8" data-testid="problem-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="The old way" title="Your visitor experience should be better." copy="Traditional visitor management creates friction where your organisation should feel most welcoming. Paper records, manual routines and limited visibility make everyday arrivals harder than they need to be." />
            </Reveal>

            {/* Seamless interconnected friction stream (no bulky grid cards) */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3" data-testid="problem-points-flow">
              {problemCards.map(({ title, icon: Icon }, index) => (
                <div
                  key={title}
                  className="flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-[#F4F7F6] px-4 py-2 text-xs font-semibold text-[#172525] transition-colors hover:border-[#035352]/40 hover:bg-white"
                >
                  <span className="flex size-6 items-center justify-center rounded-full bg-white text-[#05706f] shadow-sm">
                    <Icon className="size-3.5" />
                  </span>
                  <span>{title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">0{index + 1}</span>
                </div>
              ))}
            </div>

            <Reveal className="mt-5 flex flex-col justify-between gap-3.5 rounded-2xl bg-[#e6f0f0] p-4 sm:flex-row sm:items-center sm:p-5 border border-[#035352]/15" delay={0.1}>
              <div>
                <p className="eyebrow">The shift</p>
                <h3 className="mt-0.5 font-heading text-base font-bold tracking-[-0.04em] text-[#035352] sm:text-lg" data-testid="problem-transition-heading">Digi-Gate changes that.</h3>
              </div>
              <Link to="/benefits" className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#035352] cursor-pointer" data-testid="problem-transition-link">
                See what better looks like <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="bg-[#F4F7F6] py-6 sm:py-8" data-testid="solution-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="The Digi-Gate solution" title="Bring your visitor management into a modern digital system." copy="Digi-Gate gives organisations a centralised and professional way to manage visitors, hosts and visit activity — helping teams work smarter while creating a better experience for every guest." />
            </Reveal>
            <Reveal delay={0.08}>
              <SolutionInteractiveFlow />
            </Reveal>
          </div>
        </section>

        <section id="benefits" className="scroll-mt-20 sm:scroll-mt-24 overflow-hidden bg-white py-6 sm:py-8" data-testid="benefits-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="Built for impact" title="Why organisations choose Digi-Gate" copy="A better visitor experience is not just nicer for guests. It gives every team a clearer, more confident way to work." />
            </Reveal>
          </div>

          {/* Single-line Smooth Revolving Circular Carousel */}
          <div className="relative mt-6 sm:mt-8 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]" data-testid="benefit-cards-revolving">
            <div className="flex w-max gap-4 sm:gap-5 animate-marquee py-2">
              {[...benefits, ...benefits].map(({ title, copy, icon: Icon }, index) => (
                <div
                  key={`${title}-${index}`}
                  className="group flex w-[260px] sm:w-[310px] shrink-0 min-h-[160px] sm:min-h-[175px] flex-col items-start justify-between rounded-2xl border border-slate-200/90 bg-[#F4F7F6] p-4 sm:p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#035352]/40 hover:shadow-xl hover:shadow-[#035352]/[0.08] hover:bg-white cursor-pointer"
                  data-testid={`benefit-card-${title.toLowerCase().replaceAll(" ", "-")}-${index}`}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#05706f] shadow-sm ring-1 ring-slate-200 transition-colors duration-300 group-hover:bg-[#035352] group-hover:text-[#F3E8BC]">
                    <Icon className="size-4.5" />
                  </div>
                  <div className="mt-3 w-full text-left">
                    <h3 className="font-heading text-sm sm:text-base font-bold tracking-tight text-[#172525]">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#4a5d5c]">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 sm:scroll-mt-24 relative overflow-hidden bg-[#F4F7F6] py-8 sm:py-12" data-testid="how-it-works-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro
                eyebrow="How it works"
                title="Simple for your team. Simple for your visitors."
                copy="A clear, connected arrival flow where each step leads naturally into the next."
              />
            </Reveal>

            {/* Open 4-Stage Connected Progress */}
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" data-testid="how-it-works-steps">
              {howSteps.map(({ step, title, copy, icon: StepIcon }, idx) => (
                <Reveal key={step} delay={idx * 0.08}>
                  <div className="space-y-3" data-testid={`how-it-works-step-${step}`}>
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-[#035352] text-[#F3E8BC] font-mono text-xs font-bold shadow">
                        <StepIcon className="size-4" />
                      </span>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#05706f]">
                        Stage 0{idx + 1}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-bold text-[#172525]">
                      {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4a5d5c] leading-relaxed">
                      {copy}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-white py-6 sm:py-8" data-testid="who-benefits-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro
                eyebrow="For every team"
                title="One solution. Benefits across your organisation."
                copy="Empower every team with purpose-built visitor workflows and clear oversight."
              />
            </Reveal>
          </div>

          <div className="relative mt-6 sm:mt-8 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]" data-testid="organisation-benefits-revolving">
            <div className="flex w-max gap-4 sm:gap-5 animate-marquee py-2">
              {[
                ["Reception teams", "Less paperwork. Less repetitive work. More efficient visitor handling.", "01"],
                ["Security teams", "Better visibility over visitor activity and organised records.", "02"],
                ["Employees & hosts", "Stay informed when visitors arrive and manage visits more efficiently.", "03"],
                ["Management", "Get a clearer view of visitor activity and workplace operations.", "04"],
                ["Visitors", "Enjoy a smoother and more professional arrival experience.", "05"],
                ["Reception teams", "Less paperwork. Less repetitive work. More efficient visitor handling.", "01"],
                ["Security teams", "Better visibility over visitor activity and organised records.", "02"],
                ["Employees & hosts", "Stay informed when visitors arrive and manage visits more efficiently.", "03"],
                ["Management", "Get a clearer view of visitor activity and workplace operations.", "04"],
                ["Visitors", "Enjoy a smoother and more professional arrival experience.", "05"],
              ].map(([title, copy, number], index) => (
                <div
                  key={`${title}-${index}`}
                  className="group flex w-[260px] sm:w-[310px] shrink-0 min-h-[160px] sm:min-h-[175px] flex-col items-start justify-between rounded-2xl border border-slate-200/90 bg-[#F4F7F6] p-4 sm:p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#035352]/40 hover:shadow-xl hover:shadow-[#035352]/[0.08] hover:bg-white cursor-pointer"
                  data-testid={`organisation-benefit-${title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}-${index}`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="flex size-7.5 sm:size-8 items-center justify-center rounded-xl bg-white text-[#035352] shadow-sm ring-1 ring-slate-200 group-hover:bg-[#035352] group-hover:text-[#F3E8BC] transition-colors">
                      <span className="font-mono text-xs font-bold">{number}</span>
                    </span>
                    <ArrowUpRight className="size-4 text-slate-300 transition-all group-hover:text-[#035352] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div className="mt-3 w-full text-left">
                    <h3 className="font-heading text-sm sm:text-base font-bold tracking-tight text-[#172525] group-hover:text-[#035352] transition-colors">{title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#4a5d5c]">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="solutions" className="scroll-mt-20 sm:scroll-mt-24 bg-[#F4F7F6] py-6 sm:py-8" data-testid="use-cases-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="Made to fit" title="Built for organisations of every kind." copy="Wherever people arrive, Digi-Gate helps create a visitor experience that feels considered, organised and ready for what is next." />
            </Reveal>
            <Reveal delay={0.1}>
              <SolutionsSwiper />
            </Reveal>
          </div>
        </section>

        <section id="product-preview" className="scroll-mt-20 sm:scroll-mt-24 overflow-hidden bg-white py-6 sm:py-8" data-testid="product-preview-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-6 lg:grid-cols-[.85fr_1.15fr] lg:gap-10">
              <Reveal>
                <p className="eyebrow">Product experience</p>
                <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold leading-[1.2] sm:leading-[1.18] tracking-tight text-[#172525]" data-testid="product-preview-heading">Designed around the way your organisation works.</h2>
                <p className="mt-2.5 max-w-xl text-xs sm:text-sm leading-6 text-[#4a5d5c]" data-testid="product-preview-copy">This conceptual interface preview shows how a modern visitor-management experience can bring together visitor information, host awareness, visit activity and organisational oversight.</p>
                <div className="mt-4 space-y-2.5" data-testid="product-preview-feature-list">
                  {[
                    ["Visitor information", "Keep the right information in view.", FileCheck2],
                    ["Host awareness", "Help relevant teams stay informed.", Bell],
                    ["Visit activity", "Create a clearer view of what is happening.", Eye],
                    ["Organisational oversight", "Support better-informed workplace management.", Building2],
                  ].map(([title, copy, Icon]) => {
                    const PreviewIcon = Icon as IconComponent;
                    return (
                      <div key={title as string} className="flex items-center gap-3" data-testid={`product-preview-feature-${(title as string).toLowerCase().replaceAll(" ", "-")}`}>
                        <span className="flex size-7 items-center justify-center rounded-lg bg-[#e6f0f0] text-[#035352]"><PreviewIcon className="size-3.5" /></span>
                        <div>
                          <p className="text-xs font-bold text-[#172525]">{title as string}</p>
                          <p className="text-[11px] text-[#4a5d5c]">{copy as string}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button onClick={() => navigate("/register")} className="mt-5 h-10 px-6 rounded-full bg-[#035352] font-bold hover:bg-[#023e3d] text-white text-xs shadow-md shadow-[#035352]/20 flex items-center gap-2 cursor-pointer" data-testid="product-preview-cta">
                  <Building2 className="size-3.5 text-[#F3E8BC]" /> Register Your Business
                </Button>
              </Reveal>
              <Reveal delay={0.1}>
                <ConceptualProductPreview />
              </Reveal>
            </div>
          </div>
        </section>

        <section id="security" className="scroll-mt-20 sm:scroll-mt-24 relative overflow-hidden bg-[#022928] py-8 sm:py-12 text-white" data-testid="trust-section">
          <div className="absolute right-[-8rem] top-[-10rem] size-[32rem] rounded-full bg-[#05706f]/25 blur-3xl pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <Reveal className="max-w-xl">
                <p className="eyebrow text-[#F3E8BC]">Trust & control</p>
                <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight text-white" data-testid="security-heading">
                  A more organised and controlled visitor process.
                </h2>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-teal-100/75" data-testid="security-copy">
                  Digi-Gate brings enterprise structure, TLS 1.3 encryption, and complete access visibility to your workplace.
                </p>
                <Button onClick={() => navigate("/register")} variant="outline" className="mt-5 h-10 rounded-full border-[#F3E8BC]/30 bg-white/5 px-5 font-bold text-white text-xs hover:bg-white/10 hover:text-white cursor-pointer" data-testid="security-cta">
                  Register Your Workplace<ArrowRight className="ml-2 size-3.5 text-[#F3E8BC]" />
                </Button>
              </Reveal>

              <Reveal delay={0.1} className="flex-1 max-w-xl">
                <div className="space-y-3.5 border-t lg:border-t-0 lg:border-l border-white/15 pt-4 lg:pt-0 lg:pl-8">
                  {[
                    "TLS 1.3 encrypted data transmission & AES-256 storage",
                    "Automated GDPR-compliant visitor log purge schedules",
                    "Real-time SMS / WhatsApp OTP visitor authentication",
                    "Live on-site occupancy rosters for building safety drills",
                    "Tamper-resistant digital gate pass credentials",
                  ].map((point) => (
                    <div key={point} className="flex items-center gap-3 text-xs sm:text-sm font-medium text-teal-50">
                      <span className="flex size-5 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 shrink-0">
                        <Check className="size-3 stroke-[3]" />
                      </span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-[#F4F7F6] py-8 sm:py-12" data-testid="comparison-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="Make the shift" title="From visitor register to visitor experience." copy="A professional arrival starts with replacing the friction of yesterday with the clarity of today." />
            </Reveal>

            {/* Open Comparative Breakdown (No Double Box Cards) */}
            <div className="mt-8 flex flex-col md:flex-row items-stretch justify-between gap-8 md:gap-12 border-t border-slate-200 pt-8" data-testid="comparison-grid">
              {/* Left: Traditional */}
              <div className="flex-1 space-y-3" data-testid="traditional-comparison-card">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                    The Old Way
                  </span>
                  <h3 className="font-heading text-lg font-bold text-[#172525]">Traditional Paper Routines</h3>
                </div>
                <div className="space-y-2.5 pt-2">
                  {["Paper-based registers exposed to all guests", "Manual telephone calls & reception bottlenecks", "Scattered visitor logs with zero real-time visibility", "Slow entrance lines and delayed meeting starts"].map((item) => (
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#4a5d5c]" key={item}>
                      <span className="flex size-4 items-center justify-center rounded-full bg-rose-100 text-rose-600 shrink-0"><X className="size-2.5 stroke-[3]" /></span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vertical Divider Line */}
              <div className="hidden md:block w-px bg-slate-200" />

              {/* Right: Digi-Gate */}
              <div className="flex-1 space-y-3" data-testid="digigate-comparison-card">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#05706f] bg-[#e6f0f0] px-2.5 py-0.5 rounded-full">
                    The Digi-Gate Way
                  </span>
                  <h3 className="font-heading text-lg font-bold text-[#035352]">Modern Contactless Arrival</h3>
                </div>
                <div className="space-y-2.5 pt-2">
                  {["18-second contactless smartphone check-in", "Sub-second WhatsApp & SMS host notifications", "Live digital occupancy roster for total workplace clarity", "Encrypted digital pass ready for turnstile access"].map((item) => (
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#172525]" key={item}>
                      <span className="flex size-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0"><Check className="size-2.5 stroke-[3]" /></span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 sm:scroll-mt-24 bg-white py-6 sm:py-8" data-testid="faq-section">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="Questions, answered" title="A clearer way to get started." copy="If you are thinking about the experience your organisation creates for visitors, you are already asking the right questions." />
            </Reveal>
            <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200" data-testid="faq-accordion">
              {faqs.map(([question, answer], index) => {
                const isOpen = activeFaq === index;
                return (
                  <Reveal key={question} delay={index * 0.05}>
                    <div data-testid={`faq-accordion-item-${index + 1}`}>
                      <button className="flex w-full items-center justify-between gap-4 py-3 sm:py-3.5 text-left cursor-pointer" onClick={() => setActiveFaq(isOpen ? null : index)} aria-expanded={isOpen} data-testid={`faq-question-${index + 1}`}>
                        <span className="font-heading text-sm sm:text-base font-bold tracking-[-0.02em] text-[#172525]">{question}</span>
                        <span className={`flex size-6 shrink-0 items-center justify-center rounded-full border border-slate-200 text-[#035352] transition-transform duration-300 ${isOpen ? "rotate-180 bg-[#e6f0f0]" : ""}`}>
                          <ChevronDown className="size-3" />
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                            <p className="max-w-3xl pb-3.5 pr-6 text-xs sm:text-sm leading-6 text-[#4a5d5c]" data-testid={`faq-answer-${index + 1}`}>{answer}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="register-business" className="scroll-mt-20 sm:scroll-mt-24 bg-[#F4F7F6] py-6 sm:py-8" data-testid="register-business-section">
          <div id="contact" className="scroll-mt-20 sm:scroll-mt-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-testid="contact-section">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#022928] via-[#035352] to-[#011f1e] p-6 sm:p-8 text-white shadow-xl shadow-[#035352]/20 border border-white/10">
                <div className="absolute -right-20 -top-20 size-80 rounded-full bg-[#05706f]/30 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 size-80 rounded-full bg-[#F3E8BC]/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold leading-[1.2] tracking-tight text-white" data-testid="register-section-heading">
                      Want to use Digi-Gate for your organisation?
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-teal-100/85" data-testid="register-section-copy">
                      Register your organisation details today to modernise your entrance, automate visitor passes, and gain complete workplace oversight.
                    </p>
                    <div className="mt-3.5 flex flex-wrap items-center gap-4 text-xs text-teal-100/70">
                      <span className="flex items-center gap-1.5 font-medium"><ShieldCheck className="size-3.5 text-[#F3E8BC]" /> Zero hardware lock-in</span>
                      <span className="flex items-center gap-1.5 font-medium"><Sparkles className="size-3.5 text-[#F3E8BC]" /> 5-minute fast setup</span>
                      <span className="flex items-center gap-1.5 font-medium"><Zap className="size-3.5 text-[#F3E8BC]" /> Instant host notifications</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start lg:items-center gap-4 shrink-0">
                    <Button
                      onClick={() => navigate("/register")}
                      className="h-10 sm:h-11 rounded-full bg-[#F3E8BC] hover:bg-[#e8da9d] px-6 text-xs sm:text-sm font-bold text-[#035352] shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      data-testid="register-section-cta"
                    >
                      <Building2 className="size-4 text-[#035352]" />
                      <span>Register Your Organisation</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
