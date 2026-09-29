import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useNavigate } from "react-router-dom";
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
  Menu,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type IconComponent = any;

const navItems = [
  ["Why Digi-Gate", "#why-digi-gate", "nav-link-why-digi-gate"],
  ["Benefits", "#benefits", "nav-link-benefits"],
  ["How It Works", "#how-it-works", "nav-link-how-it-works"],
  ["Solutions", "#solutions", "nav-link-solutions"],
  ["Security", "#security", "nav-link-security"],
  ["FAQ", "#faq", "nav-link-faq"],
] as const;

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

function LogoMark({ light = false, testId }: { light?: boolean; testId: string }) {
  return (
    <span className="flex items-center gap-2.5" data-testid={testId}>
      <span className={`relative flex size-9 items-center justify-center rounded-xl shadow-sm ${light ? "bg-white/10 ring-1 ring-white/15" : "bg-[#035352]"}`}>
        <span className="absolute left-[9px] top-[8px] h-3 w-3 rounded-[4px] bg-[#F3E8BC]" />
        <span className="absolute bottom-[8px] right-[8px] h-3 w-3 rounded-[4px] bg-white" />
        <span className="absolute left-[15px] top-[15px] h-[9px] w-[9px] rounded-[3px] bg-[#05706f]" />
      </span>
      <span className={`font-heading text-[1.2rem] font-extrabold tracking-[-0.04em] ${light ? "text-white" : "text-[#035352]"}`}>Digi-Gate</span>
    </span>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
  y = 35,
  duration = 0.7,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "0px 0px -60px 0px" });

  return (
    <div ref={ref} className={`h-full ${className}`}>
      <motion.div
        className="h-full flex flex-col"
        initial={{ opacity: 0, y, filter: "blur(4px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y, filter: "blur(4px)" }}
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
  const isInView = useInView(ref, { once: false, margin: "0px 0px -60px 0px" });

  return (
    <div ref={ref} className="max-w-2xl">
      <motion.p
        className="eyebrow"
        data-testid={`section-eyebrow-${id}`}
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.2] sm:leading-[1.18] tracking-tight text-[#172525]"
        data-testid={`section-heading-${id}`}
        initial={{ opacity: 0, y: 28, filter: "blur(3px)" }}
        animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 28, filter: "blur(3px)" }}
        transition={{ duration: 0.7, delay: isInView ? 0.08 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h2>
      {copy && (
        <motion.p
          className="mt-5 max-w-2xl text-base leading-8 text-[#4a5d5c] sm:text-lg"
          data-testid={`section-copy-${id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: isInView ? 0.16 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          {copy}
        </motion.p>
      )}
    </div>
  );
}

function ConceptualArrivalVisual() {
  return (
    <div className="relative mx-auto aspect-[0.96] w-full max-w-[600px]" data-testid="hero-conceptual-visual">
      {/* Background Glows */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-[#035352]/20 via-[#05706f]/15 to-[#F3E8BC]/25 blur-3xl -z-10" />

      {/* Main Terminal Frame */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-b from-[#023e3d] via-[#035352] to-[#012524] p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(3,83,82,0.35)]">

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
        className="absolute -left-3 top-[18%] hidden sm:flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl shadow-[#035352]/10 backdrop-blur-xl"
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
        className="absolute -right-3 bottom-[12%] hidden sm:flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl shadow-[#035352]/10 backdrop-blur-xl"
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



export default function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F4F7F6] text-[#172525]" data-testid="digi-gate-marketing-site">
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${scrolled ? "border-b border-slate-200/90 bg-white/95 shadow-[0_10px_40px_rgba(3,83,82,.08)] backdrop-blur-xl" : "bg-transparent"}`} data-testid="nav-bar">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#top" aria-label="Digi-Gate home" data-testid="nav-brand-link"><LogoMark testId="brand-logo-header" /></a>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation" data-testid="desktop-navigation">
            {navItems.map(([label, href, testId]) => <a key={href} href={href} className="text-sm font-semibold text-[#4a5d5c] hover:text-[#035352] transition-colors" data-testid={testId}>{label}</a>)}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Button onClick={() => navigate("/register")} className="h-10 rounded-full bg-[#035352] px-6 text-xs font-bold text-white shadow-md shadow-[#035352]/20 hover:bg-[#023e3d] transition-all flex items-center gap-2 cursor-pointer" data-testid="nav-cta-register-business">
              <Building2 className="size-4 text-[#F3E8BC]" /> Register Business
            </Button>
          </div>
          <button className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-[#035352] lg:hidden cursor-pointer" onClick={() => setMobileMenuOpen((current) => !current)} aria-label="Toggle navigation" data-testid="mobile-menu-toggle-button">
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-slate-200 bg-white px-5 py-5 lg:hidden" aria-label="Mobile navigation" data-testid="mobile-navigation">
              <div className="flex flex-col gap-1">
                {navItems.map(([label, href, testId]) => <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-[#4a5d5c] hover:bg-[#e6f0f0] hover:text-[#035352]" data-testid={`${testId}-mobile`}>{label}</a>)}
              </div>
              <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4">
                <Button onClick={() => { setMobileMenuOpen(false); navigate("/register"); }} className="w-full h-11 rounded-full bg-[#035352] font-bold text-white flex items-center justify-center gap-2" data-testid="nav-cta-register-business-mobile">
                  <Building2 className="size-4 text-[#F3E8BC]" /> Register Business
                </Button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="top">
        <section className="relative isolate overflow-hidden bg-[#F4F7F6] pt-32 sm:pt-40 lg:pt-44" data-testid="hero-section">
          {/* Subtle modern mesh ambient lights */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_14%,rgba(5,112,111,.14),transparent_35%),radial-gradient(circle_at_12%_25%,rgba(3,83,82,.08),transparent_30%)]" />

          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:px-8 lg:pb-28">
            <Reveal className="relative z-10 max-w-2xl">
              {/* Product Badge Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#035352]/20 bg-[#e6f0f0]/90 px-3.5 py-1 text-xs font-bold text-[#035352] shadow-sm mb-6 backdrop-blur-sm">
                <Sparkles className="size-3.5 text-[#05706f]" />
                <span>Next-Gen Visitor Management & Gate Pass System</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[4.25rem] font-extrabold leading-[1.18] sm:leading-[1.12] tracking-tight text-[#172525]" data-testid="hero-headline">
                A smarter way to manage <span className="bg-gradient-to-r from-[#035352] via-[#05706f] to-[#023e3d] bg-clip-text text-transparent underline decoration-[#F3E8BC] decoration-4 underline-offset-8">every visitor</span>.
              </h1>

              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-[#4a5d5c]" data-testid="hero-supporting-text">
                Digi-Gate replaces traditional paper registers with contactless QR check-ins, instant host alerts, and verified digital gate passes for modern organisations.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row" data-testid="hero-cta-group">
                <Button onClick={() => navigate("/register")} size="lg" className="h-12 rounded-full bg-[#035352] hover:bg-[#023e3d] px-8 text-sm font-bold text-white shadow-lg shadow-[#035352]/20 hover:-translate-y-0.5 flex items-center justify-center gap-2.5 transition-all cursor-pointer" data-testid="hero-cta-register-business">
                  <Building2 className="size-4 text-[#F3E8BC]" /> Register Business
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-[#4a5d5c]" data-testid="hero-trust-line">
                <span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-emerald-600" /> Enterprise-grade security</span>
                <span className="size-1 rounded-full bg-[#05706f]" />
                <span className="flex items-center gap-1.5"><Zap className="size-3.5 text-amber-500" /> Instant host notification</span>
                <span className="size-1 rounded-full bg-[#05706f]" />
                <span className="flex items-center gap-1.5"><Sparkles className="size-3.5 text-[#05706f]" /> Contactless QR entry</span>
              </div>
            </Reveal>

            <Reveal className="relative mt-2 lg:mt-0" delay={0.15}>
              <ConceptualArrivalVisual />
            </Reveal>
          </div>

          <div className="border-y border-slate-200 bg-white/70" data-testid="hero-trust-strip">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a5d5c]">Trusted for modern workplace arrivals & security</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#4a5d5c]/80">
                <span>Corporate Workplaces</span>
                <span>Tech Parks</span>
                <span>Educational Campuses</span>
                <span>Healthcare Facilities</span>
              </div>
            </div>
          </div>
        </section>

        <section id="why-digi-gate" className="bg-white py-24 lg:py-32" data-testid="problem-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="The old way" title="Your visitor experience should be better." copy="Traditional visitor management creates friction where your organisation should feel most welcoming. Paper records, manual routines and limited visibility make everyday arrivals harder than they need to be." />
            </Reveal>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-stretch" data-testid="problem-cards-grid">
              {problemCards.map(({ title, copy, icon: Icon }, index) => (
                <Reveal key={title} delay={index * 0.06} className="h-full">
                  <div className="group flex h-full min-h-[260px] flex-col justify-between rounded-2xl border border-slate-200 bg-[#F4F7F6] p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#035352]/40 hover:shadow-xl hover:shadow-[#035352]/[0.07]" data-testid={`problem-card-${title.toLowerCase().replaceAll(" ", "-")}`}>
                    <div>
                      <span className="flex size-11 items-center justify-center rounded-xl bg-white text-[#05706f] shadow-sm ring-1 ring-slate-200 transition-colors duration-300 group-hover:bg-[#035352] group-hover:text-[#F3E8BC]">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="mt-6 font-heading text-lg font-bold tracking-tight text-[#172525]">{title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#4a5d5c]">{copy}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-24 flex flex-col justify-between gap-6 rounded-3xl bg-[#e6f0f0] p-7 sm:flex-row sm:items-center sm:p-10 border border-[#035352]/15" delay={0.1}>
              <div>
                <p className="eyebrow">The shift</p>
                <h3 className="mt-3 font-heading text-2xl font-bold tracking-[-0.04em] text-[#035352] sm:text-3xl" data-testid="problem-transition-heading">Digi-Gate changes that.</h3>
              </div>
              <a href="#benefits" className="group inline-flex items-center gap-2 text-sm font-bold text-[#035352]" data-testid="problem-transition-link">
                See what better looks like <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>
        </section>

        <section className="bg-[#F4F7F6] py-24 lg:py-32" data-testid="solution-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="The Digi-Gate solution" title="Bring your visitor management into a modern digital system." copy="Digi-Gate gives organisations a centralised and professional way to manage visitors, hosts and visit activity — helping teams work smarter while creating a better experience for every guest." />
            </Reveal>
            <div className="mt-14 grid gap-5 lg:grid-cols-3 items-stretch" data-testid="solution-benefits-grid">
              <Reveal className="h-full">
                <div className="flex h-full min-h-[300px] flex-col justify-between rounded-3xl bg-[#035352] p-8 text-white shadow-xl shadow-[#035352]/20 sm:p-10" data-testid="solution-benefit-simpler">
                  <div>
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-[#F3E8BC]"><Zap className="size-6" /></span>
                    <p className="mt-12 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3E8BC]">01 / Simpler</p>
                    <h3 className="mt-3 font-heading text-2xl font-bold tracking-[-0.04em]">Less manual work.</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-teal-100/80">Reduce manual visitor management and unnecessary paperwork.</p>
                </div>
              </Reveal>
              <Reveal delay={0.08} className="h-full">
                <div className="flex h-full min-h-[300px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10" data-testid="solution-benefit-smarter">
                  <div>
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-[#e6f0f0] text-[#035352]"><Eye className="size-6" /></span>
                    <p className="mt-12 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#05706f]">02 / Smarter</p>
                    <h3 className="mt-3 font-heading text-2xl font-bold tracking-[-0.04em] text-[#172525]">A clearer view.</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#4a5d5c]">Give teams better visibility into visitor activity and the day ahead.</p>
                </div>
              </Reveal>
              <Reveal delay={0.16} className="h-full">
                <div className="flex h-full min-h-[300px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10" data-testid="solution-benefit-professional">
                  <div>
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#10B981]"><Sparkles className="size-6" /></span>
                    <p className="mt-12 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#10B981]">03 / More professional</p>
                    <h3 className="mt-3 font-heading text-2xl font-bold tracking-[-0.04em] text-[#172525]">A better welcome.</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[#4a5d5c]">Create a modern experience from the moment a visitor arrives.</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="benefits" className="bg-white py-24 lg:py-32" data-testid="benefits-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="Built for impact" title="Why organisations choose Digi-Gate" copy="A better visitor experience is not just nicer for guests. It gives every team a clearer, more confident way to work." />
            </Reveal>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch" data-testid="benefit-cards-grid">
              {benefits.map(({ title, copy, icon: Icon }, index) => (
                <Reveal key={title} delay={(index % 4) * 0.05} className="h-full">
                  <div className="group flex h-full min-h-[220px] flex-col justify-between rounded-2xl border border-slate-200 bg-[#F4F7F6] p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#035352]/40 hover:shadow-xl hover:shadow-[#035352]/[0.07]" data-testid={`benefit-card-${title.toLowerCase().replaceAll(" ", "-")}`}>
                    <div>
                      <div className="flex size-10 items-center justify-center rounded-xl bg-white text-[#05706f] shadow-sm ring-1 ring-slate-200 transition-colors duration-300 group-hover:bg-[#035352] group-hover:text-[#F3E8BC]">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="mt-6 font-heading text-lg font-bold tracking-tight text-[#172525]">{title}</h3>
                      <p className="mt-2.5 text-sm leading-6 text-[#4a5d5c]">{copy}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-[#F4F7F6] py-24 lg:py-32" data-testid="how-it-works-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="How it works" title="Simple for your team. Simple for your visitors." copy="A clear, considered flow that makes the arrival experience feel natural for everyone involved." />
            </Reveal>
            <div className="relative mt-16 grid gap-8 md:grid-cols-4 items-stretch" data-testid="how-it-works-steps">
              <div className="absolute left-[10%] right-[10%] top-8 hidden border-t border-dashed border-[#035352]/30 md:block" />
              {howSteps.map(({ step, title, copy, icon: StepIcon }, index) => (
                <Reveal key={step} delay={index * 0.08} className="h-full">
                  <div className="relative z-10 flex h-full flex-col justify-start" data-testid={`how-it-works-step-${step}`}>
                    <div className="flex size-16 items-center justify-center rounded-2xl border-4 border-[#F4F7F6] bg-[#035352] text-[#F3E8BC] shadow-lg shadow-[#035352]/20">
                      <StepIcon className="size-6" />
                    </div>
                    <p className="mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#05706f]">{step}</p>
                    <h3 className="mt-3 font-heading text-xl font-bold tracking-[-0.035em] text-[#172525]">{title}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-[#4a5d5c]">{copy}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24 lg:py-32" data-testid="who-benefits-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="For every team" title="One solution. Benefits across your organisation." />
            </Reveal>
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-stretch" data-testid="organisation-benefits-grid">
              {[
                ["Reception teams", "Less paperwork. Less repetitive work. More efficient visitor handling.", "01"],
                ["Security teams", "Better visibility over visitor activity and organised records.", "02"],
                ["Employees & hosts", "Stay informed when visitors arrive and manage visits more efficiently.", "03"],
                ["Management", "Get a clearer view of visitor activity and workplace operations.", "04"],
                ["Visitors", "Enjoy a smoother and more professional arrival experience.", "05"],
              ].map(([title, copy, number], index) => (
                <Reveal key={title} delay={index * 0.06} className="h-full">
                  <div className={`group flex h-full min-h-48 flex-col justify-between rounded-2xl border border-slate-200 p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#035352]/[0.07] ${index === 0 ? "bg-[#e6f0f0] border-[#035352]/20" : "bg-[#F4F7F6]"}`} data-testid={`organisation-benefit-${title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`}>
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-white text-[#035352] shadow-sm"><span className="font-mono text-xs font-bold">{number}</span></span>
                      <ArrowUpRight className="size-4 text-[#05706f] opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div>
                      <h3 className="mt-8 font-heading text-lg font-bold tracking-tight text-[#172525]">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#4a5d5c]">{copy}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="solutions" className="bg-[#F4F7F6] py-24 lg:py-32" data-testid="use-cases-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="Made to fit" title="Built for organisations of every kind." copy="Wherever people arrive, Digi-Gate helps create a visitor experience that feels considered, organised and ready for what is next." />
            </Reveal>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-stretch" data-testid="use-cases-grid">
              {useCases.map(({ title, copy, icon: Icon }, index) => (
                <Reveal key={title} delay={(index % 4) * 0.05} className="h-full">
                  <div className="group flex h-full min-h-[220px] flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#035352]/40 hover:shadow-xl hover:shadow-[#035352]/[0.08]" data-testid={`use-case-card-${title.toLowerCase().replaceAll(" ", "-")}`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="flex size-11 items-center justify-center rounded-xl bg-[#e6f0f0] text-[#035352] shadow-sm ring-1 ring-[#035352]/10 transition-all duration-300 group-hover:bg-[#035352] group-hover:text-[#F3E8BC]">
                          <Icon className="size-5" />
                        </span>
                        <ArrowUpRight className="size-4 text-slate-300 transition-all duration-300 group-hover:text-[#035352] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      <h3 className="mt-6 font-heading text-lg font-bold tracking-tight text-[#172525]">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#4a5d5c]">{copy}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="product-preview" className="overflow-hidden bg-white py-24 lg:py-32" data-testid="product-preview-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
              <Reveal>
                <p className="eyebrow">Product experience</p>
                <h2 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.2] sm:leading-[1.18] tracking-tight text-[#172525]" data-testid="product-preview-heading">Designed around the way your organisation works.</h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-[#4a5d5c] sm:text-lg" data-testid="product-preview-copy">This conceptual interface preview shows how a modern visitor-management experience can bring together visitor information, host awareness, visit activity and organisational oversight.</p>
                <div className="mt-9 space-y-4" data-testid="product-preview-feature-list">
                  {[
                    ["Visitor information", "Keep the right information in view.", FileCheck2],
                    ["Host awareness", "Help relevant teams stay informed.", Bell],
                    ["Visit activity", "Create a clearer view of what is happening.", Eye],
                    ["Organisational oversight", "Support better-informed workplace management.", Building2],
                  ].map(([title, copy, Icon]) => {
                    const PreviewIcon = Icon as IconComponent;
                    return (
                      <div key={title as string} className="flex items-center gap-4" data-testid={`product-preview-feature-${(title as string).toLowerCase().replaceAll(" ", "-")}`}>
                        <span className="flex size-10 items-center justify-center rounded-xl bg-[#e6f0f0] text-[#035352]"><PreviewIcon className="size-4" /></span>
                        <div>
                          <p className="text-sm font-bold text-[#172525]">{title as string}</p>
                          <p className="mt-1 text-xs text-[#4a5d5c]">{copy as string}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button onClick={() => navigate("/register")} className="mt-10 h-12 px-7 rounded-full bg-[#035352] font-bold hover:bg-[#023e3d] text-white shadow-md shadow-[#035352]/20 flex items-center gap-2 cursor-pointer" data-testid="product-preview-cta">
                  <Building2 className="size-4 text-[#F3E8BC]" /> Register Your Business
                </Button>
              </Reveal>
              <Reveal delay={0.1}>
                <ConceptualProductPreview />
              </Reveal>
            </div>
          </div>
        </section>

        <section id="security" className="relative overflow-hidden bg-[#022928] py-24 text-white lg:py-32" data-testid="trust-section">
          <div className="absolute right-[-8rem] top-[-10rem] size-[32rem] rounded-full bg-[#05706f]/25 blur-3xl pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <Reveal>
                <p className="eyebrow text-[#F3E8BC]">Trust & control</p>
                <h2 className="mt-4 max-w-xl font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.2] sm:leading-[1.18] tracking-tight text-white" data-testid="security-heading">A more organised and controlled visitor process.</h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-teal-100/75 sm:text-lg" data-testid="security-copy">Digi-Gate is designed to help organisations bring structure, visibility and control to the way they manage visitor activity.</p>
                <Button onClick={() => navigate("/register")} variant="outline" className="mt-9 h-12 rounded-full border-[#F3E8BC]/30 bg-white/5 px-7 font-bold text-white hover:bg-white/10 hover:text-white cursor-pointer" data-testid="security-cta">
                  Register Your Workplace<ArrowRight className="ml-2 size-4 text-[#F3E8BC]" />
                </Button>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="grid gap-3 sm:grid-cols-2" data-testid="security-points-grid">
                  {[
                    ["Organised visitor information", FileCheck2],
                    ["A controlled digital process", LockKeyhole],
                    ["Clearer visitor activity", Eye],
                    ["Better host awareness", Bell],
                    ["Organisation-level oversight", Building2],
                  ].map(([title, Icon], index) => {
                    const SecurityIcon = Icon as IconComponent;
                    return (
                      <div className={`flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-md ${index === 4 ? "sm:col-span-2" : ""}`} key={title as string} data-testid={`security-point-${(title as string).toLowerCase().replaceAll(" ", "-")}`}>
                        <span className="flex size-10 items-center justify-center rounded-xl bg-[#05706f]/50 text-[#F3E8BC]"><SecurityIcon className="size-5" /></span>
                        <span className="text-sm font-semibold text-white/90">{title as string}</span>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-[#F4F7F6] py-24 lg:py-32" data-testid="comparison-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="Make the shift" title="From visitor register to visitor experience." copy="A professional arrival starts with replacing the friction of yesterday with the clarity of today." />
            </Reveal>
            <div className="mt-14 grid gap-5 lg:grid-cols-2" data-testid="comparison-grid">
              <Reveal>
                <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-10" data-testid="traditional-comparison-card">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-2xl font-bold tracking-[-0.04em] text-[#4a5d5c]">Traditional</h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-[#4a5d5c]">Manual approach</span>
                  </div>
                  <div className="mt-8 space-y-4">
                    {["Paper-based records", "Manual processes", "Scattered information", "Limited visibility", "Time-consuming reception", "Less professional experience"].map((item) => (
                      <div className="flex items-center gap-3 text-sm text-[#4a5d5c]" key={item}>
                        <span className="flex size-5 items-center justify-center rounded-full bg-slate-100 text-slate-400"><X className="size-3" /></span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="relative overflow-hidden rounded-3xl bg-[#035352] p-7 text-white shadow-xl shadow-[#035352]/20 sm:p-10" data-testid="digigate-comparison-card">
                  <div className="absolute -right-20 -top-20 size-56 rounded-full bg-[#F3E8BC]/15 blur-2xl" />
                  <div className="relative flex items-center justify-between">
                    <h3 className="font-heading text-2xl font-bold tracking-[-0.04em]">Digi-Gate</h3>
                    <span className="rounded-full bg-[#F3E8BC]/15 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-[#F3E8BC]">Digital approach</span>
                  </div>
                  <div className="relative mt-8 space-y-4">
                    {["Organised digital information", "More efficient visitor handling", "Better visibility", "Better host awareness", "Professional experience", "Built for organisations"].map((item) => (
                      <div className="flex items-center gap-3 text-sm text-teal-50/95" key={item}>
                        <span className="flex size-5 items-center justify-center rounded-full bg-emerald-400/20 text-[#10B981]"><Check className="size-3" /></span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-[#e6f0f0]/60 py-24 lg:py-32" data-testid="final-cta-section">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#022928] via-[#035352] to-[#011f1e] px-6 py-14 text-center shadow-2xl shadow-[#035352]/20 sm:px-12 sm:py-20">
                <div className="absolute left-1/2 top-[-12rem] size-[30rem] -translate-x-1/2 rounded-full border border-[#F3E8BC]/10 bg-[#05706f]/20 blur-2xl pointer-events-none" />
                <div className="relative">
                  <Badge className="border-[#F3E8BC]/30 bg-[#F3E8BC]/15 text-[#F3E8BC]" data-testid="final-cta-eyebrow">A better first impression starts here</Badge>
                  <h2 className="mx-auto mt-6 max-w-3xl font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.2] sm:leading-[1.18] tracking-tight text-white" data-testid="final-cta-heading">Ready to modernise your visitor experience?</h2>
                  <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-teal-100/80 sm:text-lg" data-testid="final-cta-copy">See how Digi-Gate can help your organisation create a smarter, more professional way to manage visitors.</p>
                  <div className="mt-9 flex flex-col sm:flex-row justify-center gap-4">
                    <Button onClick={() => navigate("/register")} size="lg" className="h-16 rounded-full bg-white px-8 font-bold text-[#035352] hover:-translate-y-1 hover:bg-[#F3E8BC] flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer" data-testid="final-cta-scan-qr">
                      <Building2 className="size-5 text-[#035352]" /> Register Your Organisation
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="faq" className="bg-white py-24 lg:py-32" data-testid="faq-section">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="Questions, answered" title="A clearer way to get started." copy="If you are thinking about the experience your organisation creates for visitors, you are already asking the right questions." />
            </Reveal>
            <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200" data-testid="faq-accordion">
              {faqs.map(([question, answer], index) => {
                const isOpen = activeFaq === index;
                return (
                  <Reveal key={question} delay={index * 0.05}>
                    <div data-testid={`faq-accordion-item-${index + 1}`}>
                      <button className="flex w-full items-center justify-between gap-6 py-6 text-left cursor-pointer" onClick={() => setActiveFaq(isOpen ? null : index)} aria-expanded={isOpen} data-testid={`faq-question-${index + 1}`}>
                        <span className="font-heading text-base font-bold tracking-[-0.02em] text-[#172525] sm:text-lg">{question}</span>
                        <span className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-[#035352] transition-transform duration-300 ${isOpen ? "rotate-180 bg-[#e6f0f0]" : ""}`}>
                          <ChevronDown className="size-4" />
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                            <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-[#4a5d5c]" data-testid={`faq-answer-${index + 1}`}>{answer}</p>
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

        <section id="register-business" className="bg-[#F4F7F6] py-20" data-testid="register-business-section">
          <div id="contact" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-testid="contact-section">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#022928] via-[#035352] to-[#011f1e] p-8 sm:p-14 text-white shadow-2xl shadow-[#035352]/20 border border-white/10">
                <div className="absolute -right-20 -top-20 size-80 rounded-full bg-[#05706f]/30 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 size-80 rounded-full bg-[#F3E8BC]/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <Badge className="border-[#F3E8BC]/30 bg-[#F3E8BC]/15 text-[#F3E8BC] mb-4" data-testid="register-section-badge">
                      For Businesses & Institutions
                    </Badge>
                    <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.2] sm:leading-[1.18] tracking-tight text-white" data-testid="register-section-heading">
                      Want to use Digi-Gate for your organisation?
                    </h2>
                    <p className="mt-4 text-base sm:text-lg leading-relaxed text-teal-100/85" data-testid="register-section-copy">
                      Register your organisation details today to modernise your entrance, automate visitor passes, and gain complete workplace oversight.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-teal-100/70">
                      <span className="flex items-center gap-2 font-medium"><ShieldCheck className="size-4 text-[#F3E8BC]" /> Zero hardware lock-in</span>
                      <span className="flex items-center gap-2 font-medium"><Sparkles className="size-4 text-[#F3E8BC]" /> 5-minute fast setup</span>
                      <span className="flex items-center gap-2 font-medium"><Zap className="size-4 text-[#F3E8BC]" /> Instant host notifications</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start lg:items-center gap-4 shrink-0">
                    <Button
                      onClick={() => navigate("/register")}
                      className="h-12 sm:h-14 rounded-full bg-[#F3E8BC] hover:bg-[#e8da9d] px-8 text-sm sm:text-base font-bold text-[#035352] shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 cursor-pointer shrink-0"
                      data-testid="register-section-cta"
                    >
                      <Building2 className="size-5 text-[#035352]" />
                      <span>Register Your Organisation</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bg-[#011f1e] py-14 text-white" data-testid="footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
            <div>
              <LogoMark light testId="brand-logo-footer" />
              <p className="mt-5 max-w-xs text-sm leading-6 text-teal-100/65" data-testid="footer-tagline">Smart visitor management for modern organisations.</p>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F3E8BC]" data-testid="footer-positioning">A better welcome, every time.</p>
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3E8BC]">Explore</p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-teal-100/70">
                {[
                  ["Product", "#product-preview"],
                  ["Benefits", "#benefits"],
                  ["Solutions", "#solutions"],
                  ["Security", "#security"],
                ].map(([label, href]) => (
                  <a key={label} href={href} className="transition-colors hover:text-white" data-testid={`footer-link-${label.toLowerCase()}`}>{label}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3E8BC]">Company</p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-teal-100/70">
                <a href="#register-business" onClick={(e) => { e.preventDefault(); navigate("/register"); }} className="transition-colors hover:text-white font-semibold text-white" data-testid="footer-link-register">Register Business</a>
                <a href="#faq" className="transition-colors hover:text-white" data-testid="footer-link-faq">FAQ</a>
                <a href="#contact" className="transition-colors hover:text-white" data-testid="footer-link-contact">Contact</a>
                <a href="#security" className="transition-colors hover:text-white" data-testid="footer-link-trust">Trust & control</a>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3E8BC]">Ready when you are</p>
              <p className="mt-4 text-xs text-teal-100/65">Modernize your entrance today with Digi-Gate.</p>
              <div className="mt-4 flex flex-col gap-2">
                <Button onClick={() => navigate("/register")} className="h-10 rounded-full bg-white text-[#035352] hover:bg-[#F3E8BC] text-xs font-bold px-5 flex items-center gap-2 transition-colors cursor-pointer">
                  <Building2 className="size-4 text-[#05706f]" /> Business Registration
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-teal-100/50">
            <p>&copy; {new Date().getFullYear()} Digi-Gate. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 font-mono text-[10px] tracking-widest uppercase">Smart Visitor Management System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
