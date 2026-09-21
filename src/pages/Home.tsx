import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
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
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import RegisterOrgModal from "@/components/RegisterOrgModal";

type IconComponent = LucideIcon;

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
      <span className={`relative flex size-9 items-center justify-center rounded-xl ${light ? "bg-white/10 ring-1 ring-white/15" : "bg-[#06216B]"}`}>
        <span className="absolute left-[9px] top-[8px] h-3 w-3 rounded-[4px] bg-[#5BD7FF]" />
        <span className="absolute bottom-[8px] right-[8px] h-3 w-3 rounded-[4px] bg-white" />
        <span className="absolute left-[15px] top-[15px] h-[9px] w-[9px] rounded-[3px] bg-[#3F5885]" />
      </span>
      <span className={`font-heading text-[1.2rem] font-extrabold tracking-[-0.04em] ${light ? "text-white" : "text-[#06216B]"}`}>Digi-Gate</span>
    </span>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function SectionIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  const id = eyebrow.toLowerCase().replaceAll(" ", "-");
  return (
    <div className="max-w-2xl">
      <p className="eyebrow" data-testid={`section-eyebrow-${id}`}>{eyebrow}</p>
      <h2 className="mt-4 font-heading text-3xl font-bold leading-[1.08] tracking-[-0.05em] text-[#06216B] sm:text-4xl lg:text-[3.4rem]" data-testid={`section-heading-${id}`}>{title}</h2>
      {copy && <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg" data-testid={`section-copy-${id}`}>{copy}</p>}
    </div>
  );
}

function ConceptualArrivalVisual() {
  return (
    <div className="relative mx-auto aspect-[0.95] w-full max-w-[620px]" data-testid="hero-conceptual-visual">
      <div className="absolute inset-5 rounded-[2.5rem] bg-[radial-gradient(circle_at_65%_20%,rgba(56,189,248,.34),transparent_28%),linear-gradient(145deg,#0A2779_0%,#031134_72%)] shadow-[0_40px_100px_rgba(2,23,103,.27)] sm:inset-10" />
      <div className="absolute right-[6%] top-[9%] h-28 w-28 rounded-full bg-[#38BDF8]/20 blur-2xl" />
      <div className="absolute bottom-[11%] left-[4%] h-40 w-40 rounded-full bg-[#153D9F]/45 blur-3xl" />
      <div className="absolute inset-[13%] rounded-[1.8rem] border border-white/15 bg-white/[0.08] shadow-2xl backdrop-blur-xl sm:inset-[16%]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
          <div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8EB9FF]">Conceptual interface</p><p className="mt-1 text-sm font-semibold text-white">Visitor overview</p></div>
          <span className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-[#8BE7FF]"><Bell className="size-4" /></span>
        </div>
        <div className="grid gap-3 p-4 sm:gap-4 sm:p-6">
          <div className="rounded-xl border border-white/10 bg-[#061A54]/75 p-4"><div className="flex items-center justify-between"><p className="text-[10px] text-blue-100/60">Visitor information</p><span className="size-2 rounded-full bg-[#8EE7FF]" /></div><div className="mt-5 space-y-3"><span className="block h-2 w-4/5 rounded-full bg-white/25" /><span className="block h-2 w-3/5 rounded-full bg-white/10" /><span className="block h-2 w-2/3 rounded-full bg-white/10" /></div></div>
          <div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-white/10 bg-white/[0.06] p-4"><span className="flex size-8 items-center justify-center rounded-lg bg-[#153D9F]/70 text-[#8EE7FF]"><UsersRound className="size-4" /></span><p className="mt-4 text-xs font-semibold text-white">Visitor arrival</p><p className="mt-1 text-[10px] text-blue-100/60">A clear first step</p></div><div className="rounded-xl border border-white/10 bg-white/[0.06] p-4"><span className="flex size-8 items-center justify-center rounded-lg bg-[#153D9F]/70 text-[#8EE7FF]"><Eye className="size-4" /></span><p className="mt-4 text-xs font-semibold text-white">Team awareness</p><p className="mt-1 text-[10px] text-blue-100/60">Information in view</p></div></div>
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-lg bg-[#65E6B4]/10 text-[#8EF1C8]"><ShieldCheck className="size-4" /></span><div><p className="text-[10px] font-bold text-white">Organised visit information</p><p className="mt-1 text-[9px] text-blue-100/60">A more considered digital process</p></div></div></div>
        </div>
      </div>
      <motion.div className="absolute left-0 top-[26%] rounded-2xl border border-white/50 bg-white/90 p-3 shadow-[0_18px_45px_rgba(2,23,103,.22)] backdrop-blur-xl sm:-left-3" animate={{ y: [0, -7, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} data-testid="hero-floating-arrival-card"><div className="flex items-center gap-2.5"><span className="flex size-8 items-center justify-center rounded-lg bg-[#E8F8FF] text-[#0284C7]"><UsersRound className="size-4" /></span><div><p className="text-[9px] font-semibold uppercase tracking-wider text-[#3F5885]">Visitor experience</p><p className="mt-0.5 text-xs font-bold text-[#06216B]">A better arrival</p></div></div></motion.div>
      <motion.div className="absolute bottom-[18%] right-0 rounded-2xl border border-white/50 bg-white/90 p-3 shadow-[0_18px_45px_rgba(2,23,103,.22)] backdrop-blur-xl sm:-right-4" animate={{ y: [0, 7, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} data-testid="hero-floating-oversight-card"><div className="flex items-center gap-2.5"><span className="flex size-8 items-center justify-center rounded-lg bg-[#EAFBF5] text-[#14845D]"><ShieldCheck className="size-4" /></span><div><p className="text-[9px] font-semibold uppercase tracking-wider text-[#3F5885]">Organisation control</p><p className="mt-0.5 text-xs font-bold text-[#06216B]">Clearer oversight</p></div></div></motion.div>
    </div>
  );
}

function ConceptualProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl" data-testid="product-preview-visual">
      <div className="rounded-[2rem] border border-[#DCE6F7] bg-[#F1F6FD] p-3 shadow-2xl shadow-[#06216B]/10 sm:p-5">
        <div className="overflow-hidden rounded-[1.25rem] border border-white/80 bg-white">
          <div className="flex items-center justify-between border-b border-[#E8EEF7] px-5 py-4"><div className="flex items-center gap-3"><LogoMark testId="product-preview-brand-mark" /><span className="hidden border-l border-[#DCE6F7] pl-3 text-xs font-semibold text-[#3F5885] sm:inline">Conceptual interface representation</span></div><div className="flex gap-1.5"><span className="size-2 rounded-full bg-[#F5B97A]" /><span className="size-2 rounded-full bg-[#9AC6EA]" /><span className="size-2 rounded-full bg-[#8FDEBC]" /></div></div>
          <div className="grid gap-4 p-5 sm:grid-cols-[.8fr_1.2fr]">
            <div className="rounded-xl bg-[#F1F6FD] p-4"><p className="font-mono text-[9px] uppercase tracking-widest text-[#3F5885]">Organisation view</p><div className="mt-5 space-y-4"><div className="flex items-center gap-3"><span className="size-8 rounded-lg bg-[#06216B]" /><div className="flex-1 space-y-2"><span className="block h-2 w-4/5 rounded-full bg-[#B6C9E5]" /><span className="block h-2 w-3/5 rounded-full bg-[#DCE6F7]" /></div></div><div className="h-px bg-[#DCE6F7]" /><div className="space-y-3"><span className="block h-2 w-full rounded-full bg-[#DCE6F7]" /><span className="block h-2 w-4/5 rounded-full bg-[#E6EDF7]" /><span className="block h-2 w-2/3 rounded-full bg-[#E6EDF7]" /></div></div></div>
            <div><div className="flex items-center justify-between"><p className="text-xs font-bold text-[#06216B]">Visitor activity</p><span className="rounded-full bg-[#EAF2FF] px-2 py-1 font-mono text-[9px] text-[#153D9F]">Illustrative</span></div><div className="mt-5 flex h-32 items-end gap-2 border-b border-l border-[#DCE6F7] px-3 pb-0 sm:gap-3">{[32, 52, 40, 68, 48, 78, 58, 88, 66, 74].map((height, index) => <motion.div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-[#153D9F] to-[#91E5FF]" initial={{ height: 0 }} whileInView={{ height: `${height}%` }} viewport={{ once: true }} transition={{ duration: .65, delay: index * .04 }} data-testid={`product-preview-illustration-bar-${index + 1}`} />)}</div><div className="mt-6 rounded-xl border border-[#DCE6F7] p-3"><div className="flex items-center gap-3"><span className="flex size-8 items-center justify-center rounded-lg bg-[#EAF2FF] text-[#153D9F]"><Bell className="size-4" /></span><div><p className="text-[10px] font-bold text-[#06216B]">Host awareness</p><p className="mt-0.5 text-[9px] text-slate-500">Relevant information, clearly presented</p></div><Check className="ml-auto size-4 text-[#14845D]" /></div></div></div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-5 rounded-2xl border border-[#DCE6F7] bg-white p-4 shadow-xl shadow-[#06216B]/10 sm:-left-10" data-testid="product-preview-concept-label"><p className="font-mono text-[9px] uppercase tracking-widest text-[#3F5885]">For illustration only</p><p className="mt-1 text-sm font-bold text-[#06216B]">A clearer way to work</p></div>
    </div>
  );
}

function DemoModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-[1.75rem] border-[#DCE6F7] p-0 shadow-2xl shadow-[#06216B]/20 sm:rounded-[2rem]" data-testid="demo-modal">
        <div className="relative overflow-hidden bg-[#061A54] px-6 pb-8 pt-7 text-white sm:px-8 sm:pt-8"><div className="absolute -right-12 -top-16 size-44 rounded-full bg-[#38BDF8]/20 blur-3xl" /><div className="relative"><Badge className="border-white/15 bg-white/10 text-[#A8E9FF]" data-testid="demo-modal-eyebrow">Start a conversation</Badge><DialogHeader className="mt-4 text-left"><DialogTitle className="font-heading text-2xl font-bold tracking-[-0.04em] text-white sm:text-3xl" data-testid="demo-modal-title">See a smarter arrival in action.</DialogTitle><DialogDescription className="mt-2 max-w-sm text-sm leading-6 text-blue-100/75" data-testid="demo-modal-description">Welcome to the Digi-Gate visitor portal.</DialogDescription></DialogHeader></div></div>
        <div className="px-6 py-7 sm:px-8 sm:py-8" data-testid="demo-modal-placeholder-content"><div className="rounded-2xl border border-[#DCE6F7] bg-[#F8FAFC] p-5"><p className="text-sm font-bold text-[#06216B]" data-testid="demo-modal-contact-heading">Ready to Check In?</p><p className="mt-2 text-sm leading-6 text-slate-600" data-testid="demo-modal-contact-copy">Scan the gate QR code or enter your destination organization ID to complete your entry form.</p><div className="mt-5 space-y-3 text-sm"><Button onClick={() => { onOpenChange(false); navigate("/scan"); }} className="w-full h-11 bg-[#153D9F] hover:bg-[#06216B] text-white font-bold rounded-xl flex items-center justify-center gap-2"><QrCode className="size-4" /> Open QR Scanner</Button></div></div><Button onClick={() => onOpenChange(false)} className="mt-6 h-12 w-full rounded-xl bg-[#06216B] font-bold hover:bg-[#153D9F]" data-testid="demo-modal-close-button">Continue exploring<ArrowRight className="ml-2 size-4" /></Button></div>
      </DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const openDemo = () => { setMobileMenuOpen(false); setDemoOpen(true); };
  const openRegister = () => { setMobileMenuOpen(false); setRegisterOpen(true); };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-[#0F172A]" data-testid="digi-gate-marketing-site">
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${scrolled ? "border-b border-[#DCE6F7]/80 bg-white/90 shadow-[0_10px_40px_rgba(6,33,107,.08)] backdrop-blur-xl" : "bg-transparent"}`} data-testid="nav-bar">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#top" aria-label="Digi-Gate home" data-testid="nav-brand-link"><LogoMark testId="brand-logo-header" /></a>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation" data-testid="desktop-navigation">
            {navItems.map(([label, href, testId]) => <a key={href} href={href} className="text-sm font-semibold text-[#3F5885] hover:text-[#06216B] transition-colors" data-testid={testId}>{label}</a>)}
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Button onClick={() => setRegisterOpen(true)} className="rounded-xl border border-[#DCE6F7] bg-white px-4 font-bold text-[#06216B] hover:bg-[#F1F6FD] shadow-sm flex items-center gap-2" data-testid="nav-cta-register">
              <Building2 className="size-4 text-[#153D9F]" /> Register
            </Button>
            <Button onClick={() => navigate("/scan")} className="rounded-xl border border-[#DCE6F7] bg-white px-4 font-bold text-[#06216B] hover:bg-[#F1F6FD] shadow-sm flex items-center gap-2" data-testid="nav-cta-scan-qr">
              <QrCode className="size-4 text-[#153D9F]" /> Scan QR
            </Button>
            <Button onClick={openDemo} className="rounded-xl bg-[#06216B] px-5 font-bold text-white shadow-lg shadow-[#06216B]/15 hover:-translate-y-0.5 hover:bg-[#153D9F]" data-testid="nav-cta-request-demo">
              Get Started<ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          <button className="flex size-10 items-center justify-center rounded-xl border border-[#DCE6F7] bg-white/80 text-[#06216B] lg:hidden" onClick={() => setMobileMenuOpen((current) => !current)} aria-label="Toggle navigation" data-testid="mobile-menu-toggle-button">
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-[#DCE6F7] bg-white px-5 py-5 lg:hidden" aria-label="Mobile navigation" data-testid="mobile-navigation">
              <div className="flex flex-col gap-1">
                {navItems.map(([label, href, testId]) => <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-[#3F5885] hover:bg-[#F1F5FB] hover:text-[#06216B]" data-testid={`${testId}-mobile`}>{label}</a>)}
              </div>
              <div className="mt-4 flex flex-col gap-3 border-t border-[#DCE6F7] pt-4">
                <Button onClick={openRegister} className="w-full rounded-xl border border-[#DCE6F7] bg-white font-bold text-[#06216B] flex items-center justify-center gap-2" data-testid="nav-cta-register-mobile">
                  <Building2 className="size-4 text-[#153D9F]" /> Register Organisation
                </Button>
                <Button onClick={() => { setMobileMenuOpen(false); navigate("/scan"); }} className="w-full rounded-xl border border-[#DCE6F7] bg-white font-bold text-[#06216B] flex items-center justify-center gap-2" data-testid="nav-cta-scan-qr-mobile">
                  <QrCode className="size-4 text-[#153D9F]" /> Scan Gate QR
                </Button>
                <Button onClick={openDemo} className="w-full rounded-xl bg-[#06216B] font-bold text-white" data-testid="nav-cta-request-demo-mobile">
                  Get Started
                </Button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="top">
        <section className="relative isolate overflow-hidden bg-[#F8FAFC] pt-32 sm:pt-40 lg:pt-44" data-testid="hero-section">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_14%,rgba(56,189,248,.14),transparent_26%),radial-gradient(circle_at_7%_20%,rgba(21,61,159,.08),transparent_25%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-4 px-4 pb-20 sm:px-6 lg:grid-cols-[.88fr_1.12fr] lg:gap-0 lg:px-8 lg:pb-32">
            <Reveal className="relative z-10 max-w-2xl">
              <h1 className="font-heading text-5xl font-bold leading-[1.02] tracking-[-0.07em] text-[#06216B] sm:text-6xl lg:text-[5.5rem]" data-testid="hero-headline">
                A smarter way to manage <span className="relative inline-block text-[#153D9F]">every visitor<span className="absolute -bottom-1 left-0 h-1 w-2/3 rounded-full bg-[#5BD7FF] sm:-bottom-2" /></span>.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#3F5885] sm:text-xl" data-testid="hero-supporting-text">
                Digi-Gate helps organisations replace traditional paper registers with a more organised, professional digital visitor-management experience.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row" data-testid="hero-cta-group">
                <Button onClick={() => navigate("/scan")} size="lg" className="h-14 rounded-xl bg-gradient-to-r from-[#06216B] via-[#153D9F] to-[#021767] px-7 text-base font-bold shadow-xl shadow-[#06216B]/20 hover:-translate-y-1 flex items-center justify-center gap-2" data-testid="hero-cta-scan-gate">
                  <QrCode className="size-5 text-[#8EE7FF]" /> Scan Gate QR
                </Button>
                <Button onClick={() => setRegisterOpen(true)} className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-[#C9D8EF] bg-white px-7 text-base font-bold text-[#06216B] shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-[#8EB9FF] hover:shadow-lg hover:shadow-[#06216B]/10" data-testid="hero-cta-register-org">
                  Register Organisation<Building2 className="size-4" />
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-[#3F5885]" data-testid="hero-trust-line">
                <span>Built for modern organisations</span>
                <span className="size-1 rounded-full bg-[#5BD7FF]" />
                <span>Simple</span>
                <span className="size-1 rounded-full bg-[#5BD7FF]" />
                <span>Digital</span>
                <span className="size-1 rounded-full bg-[#5BD7FF]" />
                <span>Professional</span>
              </div>
            </Reveal>
            <Reveal className="relative mt-6 lg:mt-0" delay={0.15}>
              <ConceptualArrivalVisual />
            </Reveal>
          </div>
          <div className="border-y border-[#DCE6F7] bg-white/60" data-testid="hero-trust-strip">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-4 py-5 sm:px-6 lg:px-8">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#3F5885]">Designed for organisations that care about the arrival experience</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-[#3F5885]/70">
                <span>Corporate workplaces</span>
                <span>Education</span>
                <span>Healthcare</span>
                <span>Business parks</span>
              </div>
            </div>
          </div>
        </section>

        <section id="why-digi-gate" className="bg-white py-24 lg:py-32" data-testid="problem-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="The old way" title="Your visitor experience should be better." copy="Traditional visitor management creates friction where your organisation should feel most welcoming. Paper records, manual routines and limited visibility make everyday arrivals harder than they need to be." />
            </Reveal>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" data-testid="problem-cards-grid">
              {problemCards.map(({ title, copy, icon: Icon }, index) => (
                <Reveal key={title} delay={index * 0.06}>
                  <div className={`group h-full rounded-2xl border border-[#E1EAF7] bg-[#F8FAFC] p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[#AFC9EB] hover:shadow-xl hover:shadow-[#06216B]/[0.07] ${index === 0 ? "lg:translate-y-7" : index === 4 ? "lg:-translate-y-7" : ""}`} data-testid={`problem-card-${title.toLowerCase().replaceAll(" ", "-")}`}>
                    <span className="flex size-11 items-center justify-center rounded-xl bg-white text-[#153D9F] shadow-sm ring-1 ring-[#DCE6F7] transition-colors duration-300 group-hover:bg-[#06216B] group-hover:text-white">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-6 font-heading text-lg font-bold tracking-[-0.03em] text-[#06216B]">{title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-24 flex flex-col justify-between gap-6 rounded-3xl bg-[#F1F6FD] p-7 sm:flex-row sm:items-center sm:p-10" delay={0.1}>
              <div>
                <p className="eyebrow">The shift</p>
                <h3 className="mt-3 font-heading text-2xl font-bold tracking-[-0.04em] text-[#06216B] sm:text-3xl" data-testid="problem-transition-heading">Digi-Gate changes that.</h3>
              </div>
              <a href="#benefits" className="group inline-flex items-center gap-2 text-sm font-bold text-[#153D9F]" data-testid="problem-transition-link">
                See what better looks like <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
          </div>
        </section>

        <section className="bg-[#F1F6FD] py-24 lg:py-32" data-testid="solution-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="The Digi-Gate solution" title="Bring your visitor management into a modern digital system." copy="Digi-Gate gives organisations a centralised and professional way to manage visitors, hosts and visit activity — helping teams work smarter while creating a better experience for every guest." />
            </Reveal>
            <div className="mt-14 grid gap-5 lg:grid-cols-3" data-testid="solution-benefits-grid">
              <Reveal>
                <div className="rounded-3xl bg-[#06216B] p-8 text-white shadow-xl shadow-[#06216B]/15 sm:p-10" data-testid="solution-benefit-simpler">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-[#5BD7FF]"><Zap className="size-6" /></span>
                  <p className="mt-16 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#8EB9FF]">01 / Simpler</p>
                  <h3 className="mt-3 font-heading text-2xl font-bold tracking-[-0.04em]">Less manual work.</h3>
                  <p className="mt-4 text-sm leading-7 text-blue-100/75">Reduce manual visitor management and unnecessary paperwork.</p>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="rounded-3xl border border-[#DCE6F7] bg-white p-8 shadow-sm sm:p-10" data-testid="solution-benefit-smarter">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#EAF2FF] text-[#153D9F]"><Eye className="size-6" /></span>
                  <p className="mt-16 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#153D9F]">02 / Smarter</p>
                  <h3 className="mt-3 font-heading text-2xl font-bold tracking-[-0.04em] text-[#06216B]">A clearer view.</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">Give teams better visibility into visitor activity and the day ahead.</p>
                </div>
              </Reveal>
              <Reveal delay={0.16}>
                <div className="rounded-3xl border border-[#DCE6F7] bg-white p-8 shadow-sm sm:p-10" data-testid="solution-benefit-professional">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#EAFBF5] text-[#14845D]"><Sparkles className="size-6" /></span>
                  <p className="mt-16 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#14845D]">03 / More professional</p>
                  <h3 className="mt-3 font-heading text-2xl font-bold tracking-[-0.04em] text-[#06216B]">A better welcome.</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">Create a modern experience from the moment a visitor arrives.</p>
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
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="benefit-cards-grid">
              {benefits.map(({ title, copy, icon: Icon, featured }, index) => (
                <Reveal key={title} delay={(index % 4) * 0.05}>
                  <div className={`group h-full rounded-2xl border p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#06216B]/[0.07] ${featured ? "border-[#153D9F] bg-[#06216B] text-white lg:col-span-2" : "border-[#E1EAF7] bg-[#F8FAFC]"}`} data-testid={`benefit-card-${title.toLowerCase().replaceAll(" ", "-")}`}>
                    <div className={`flex size-10 items-center justify-center rounded-xl ${featured ? "bg-white/10 text-[#5BD7FF]" : "bg-white text-[#153D9F] shadow-sm ring-1 ring-[#DCE6F7]"}`}>
                      <Icon className="size-5" />
                    </div>
                    <h3 className={`mt-7 font-heading text-lg font-bold tracking-[-0.03em] ${featured ? "text-white" : "text-[#06216B]"}`}>{title}</h3>
                    <p className={`mt-3 text-sm leading-6 ${featured ? "text-blue-100/75" : "text-slate-600"}`}>{copy}</p>
                    {featured && (
                      <div className="mt-8 flex items-center gap-2 text-xs font-bold text-[#8EE7FF]">
                        Built around your organisation <ArrowRight className="size-4" />
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-[#F1F6FD] py-24 lg:py-32" data-testid="how-it-works-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="How it works" title="Simple for your team. Simple for your visitors." copy="A clear, considered flow that makes the arrival experience feel natural for everyone involved." />
            </Reveal>
            <div className="relative mt-16 grid gap-8 md:grid-cols-4" data-testid="how-it-works-steps">
              <div className="absolute left-[10%] right-[10%] top-8 hidden border-t border-dashed border-[#9DB8DD] md:block" />
              {howSteps.map(({ step, title, copy, icon: StepIcon }, index) => (
                <Reveal key={step} delay={index * 0.08}>
                  <div className="relative z-10" data-testid={`how-it-works-step-${step}`}>
                    <div className="flex size-16 items-center justify-center rounded-2xl border-4 border-[#F1F6FD] bg-[#06216B] text-[#8EE7FF] shadow-lg shadow-[#06216B]/20">
                      <StepIcon className="size-6" />
                    </div>
                    <p className="mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#153D9F]">{step}</p>
                    <h3 className="mt-3 font-heading text-xl font-bold tracking-[-0.035em] text-[#06216B]">{title}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600">{copy}</p>
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
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="organisation-benefits-grid">
              {[
                ["Reception teams", "Less paperwork. Less repetitive work. More efficient visitor handling.", "01"],
                ["Security teams", "Better visibility over visitor activity and organised records.", "02"],
                ["Employees & hosts", "Stay informed when visitors arrive and manage visits more efficiently.", "03"],
                ["Management", "Get a clearer view of visitor activity and workplace operations.", "04"],
                ["Visitors", "Enjoy a smoother and more professional arrival experience.", "05"],
              ].map(([title, copy, number], index) => (
                <Reveal key={title} delay={index * 0.06}>
                  <div className={`group flex min-h-48 flex-col justify-between rounded-2xl border border-[#E1EAF7] p-7 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#06216B]/[0.07] ${index === 0 ? "bg-[#EAF2FF]" : "bg-[#F8FAFC]"}`} data-testid={`organisation-benefit-${title.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`}>
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-white text-[#153D9F] shadow-sm"><span className="font-mono text-xs font-bold">{number}</span></span>
                      <ArrowUpRight className="size-4 text-[#8EB9FF] opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div>
                      <h3 className="mt-8 font-heading text-lg font-bold tracking-[-0.03em] text-[#06216B]">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="solutions" className="bg-[#F8FAFC] py-24 lg:py-32" data-testid="use-cases-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="Made to fit" title="Built for organisations of every kind." copy="Wherever people arrive, Digi-Gate helps create a visitor experience that feels considered, organised and ready for what is next." />
            </Reveal>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="use-cases-grid">
              {useCases.map(({ title, copy, icon: Icon, wide }, index) => (
                <Reveal key={title} delay={(index % 4) * 0.05}>
                  <div className={`group relative min-h-52 overflow-hidden rounded-2xl border border-[#DCE6F7] bg-white p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#06216B]/[0.08] ${wide ? "lg:col-span-2" : ""}`} data-testid={`use-case-card-${title.toLowerCase().replaceAll(" ", "-")}`}>
                    <span className="absolute -right-8 -top-8 size-28 rounded-full bg-[#EAF2FF] transition-transform duration-500 group-hover:scale-150" />
                    <div className="relative flex size-11 items-center justify-center rounded-xl bg-[#06216B] text-[#8EE7FF]">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="relative mt-8 font-heading text-xl font-bold tracking-[-0.04em] text-[#06216B]">{title}</h3>
                    <p className="relative mt-2 max-w-sm text-sm leading-6 text-slate-600">{copy}</p>
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
                <h2 className="mt-4 font-heading text-3xl font-bold leading-[1.08] tracking-[-0.05em] text-[#06216B] sm:text-4xl lg:text-[3.4rem]" data-testid="product-preview-heading">Designed around the way your organisation works.</h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg" data-testid="product-preview-copy">This conceptual interface preview shows how a modern visitor-management experience can bring together visitor information, host awareness, visit activity and organisational oversight.</p>
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
                        <span className="flex size-10 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#153D9F]"><PreviewIcon className="size-4" /></span>
                        <div>
                          <p className="text-sm font-bold text-[#06216B]">{title as string}</p>
                          <p className="mt-1 text-xs text-slate-500">{copy as string}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button onClick={() => navigate("/scan")} className="mt-10 rounded-xl bg-[#06216B] font-bold hover:bg-[#153D9F] flex items-center gap-2" data-testid="product-preview-cta">
                  <QrCode className="size-4" /> Scan QR to Check In
                </Button>
              </Reveal>
              <Reveal delay={0.1}>
                <ConceptualProductPreview />
              </Reveal>
            </div>
          </div>
        </section>

        <section id="security" className="relative overflow-hidden bg-[#021767] py-24 text-white lg:py-32" data-testid="trust-section">
          <div className="absolute right-[-8rem] top-[-10rem] size-[32rem] rounded-full bg-[#153D9F]/25 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <Reveal>
                <p className="eyebrow text-[#8EE7FF]">Trust & control</p>
                <h2 className="mt-4 max-w-xl font-heading text-3xl font-bold leading-[1.08] tracking-[-0.05em] text-white sm:text-4xl lg:text-[3.4rem]" data-testid="security-heading">A more organised and controlled visitor process.</h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-blue-100/70 sm:text-lg" data-testid="security-copy">Digi-Gate is designed to help organisations bring structure, visibility and control to the way they manage visitor activity.</p>
                <Button onClick={openDemo} variant="outline" className="mt-9 h-12 rounded-xl border-white/20 bg-white/5 px-5 font-bold text-white hover:bg-white/10 hover:text-white" data-testid="security-cta">
                  Talk to Our Team<ArrowRight className="ml-2 size-4" />
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
                        <span className="flex size-10 items-center justify-center rounded-xl bg-[#153D9F]/50 text-[#8EE7FF]"><SecurityIcon className="size-5" /></span>
                        <span className="text-sm font-semibold text-white/90">{title as string}</span>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-[#F8FAFC] py-24 lg:py-32" data-testid="comparison-section">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionIntro eyebrow="Make the shift" title="From visitor register to visitor experience." copy="A professional arrival starts with replacing the friction of yesterday with the clarity of today." />
            </Reveal>
            <div className="mt-14 grid gap-5 lg:grid-cols-2" data-testid="comparison-grid">
              <Reveal>
                <div className="rounded-3xl border border-[#E1EAF7] bg-white p-7 sm:p-10" data-testid="traditional-comparison-card">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-2xl font-bold tracking-[-0.04em] text-[#3F5885]">Traditional</h3>
                    <span className="rounded-full bg-[#E9EEF5] px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-[#64748B]">Manual approach</span>
                  </div>
                  <div className="mt-8 space-y-4">
                    {["Paper-based records", "Manual processes", "Scattered information", "Limited visibility", "Time-consuming reception", "Less professional experience"].map((item) => (
                      <div className="flex items-center gap-3 text-sm text-slate-500" key={item}>
                        <span className="flex size-5 items-center justify-center rounded-full bg-[#E3EAF3] text-[#94A3B8]"><X className="size-3" /></span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="relative overflow-hidden rounded-3xl bg-[#06216B] p-7 text-white shadow-xl shadow-[#06216B]/20 sm:p-10" data-testid="digigate-comparison-card">
                  <div className="absolute -right-20 -top-20 size-56 rounded-full bg-[#38BDF8]/15 blur-2xl" />
                  <div className="relative flex items-center justify-between">
                    <h3 className="font-heading text-2xl font-bold tracking-[-0.04em]">Digi-Gate</h3>
                    <span className="rounded-full bg-[#5BD7FF]/10 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-[#8EE7FF]">Digital approach</span>
                  </div>
                  <div className="relative mt-8 space-y-4">
                    {["Organised digital information", "More efficient visitor handling", "Better visibility", "Better host awareness", "Professional experience", "Built for organisations"].map((item) => (
                      <div className="flex items-center gap-3 text-sm text-blue-50/90" key={item}>
                        <span className="flex size-5 items-center justify-center rounded-full bg-[#65E6B4]/15 text-[#8EF1C8]"><Check className="size-3" /></span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="bg-[#F1F6FD] py-24 lg:py-32" data-testid="final-cta-section">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#021767] via-[#06216B] to-[#030C27] px-6 py-14 text-center shadow-2xl shadow-[#06216B]/20 sm:px-12 sm:py-20">
                <div className="absolute left-1/2 top-[-12rem] size-[30rem] -translate-x-1/2 rounded-full border border-[#8EE7FF]/10 bg-[#153D9F]/20 blur-2xl" />
                <div className="relative">
                  <Badge className="border-white/15 bg-white/10 text-[#8EE7FF]" data-testid="final-cta-eyebrow">A better first impression starts here</Badge>
                  <h2 className="mx-auto mt-6 max-w-3xl font-heading text-3xl font-bold leading-[1.08] tracking-[-0.055em] text-white sm:text-5xl" data-testid="final-cta-heading">Ready to modernise your visitor experience?</h2>
                  <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-blue-100/75 sm:text-lg" data-testid="final-cta-copy">See how Digi-Gate can help your organisation create a smarter, more professional way to manage visitors.</p>
                  <div className="mt-9 flex flex-col sm:flex-row justify-center gap-4">
                    <Button onClick={() => navigate("/scan")} size="lg" className="h-13 rounded-xl bg-white px-7 font-bold text-[#06216B] hover:-translate-y-1 hover:bg-[#E8F8FF] flex items-center justify-center gap-2" data-testid="final-cta-scan-qr">
                      <QrCode className="size-5 text-[#153D9F]" /> Scan Gate QR
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
            <div className="mt-12 divide-y divide-[#DCE6F7] border-y border-[#DCE6F7]" data-testid="faq-accordion">
              {faqs.map(([question, answer], index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={question} data-testid={`faq-accordion-item-${index + 1}`}>
                    <button className="flex w-full items-center justify-between gap-6 py-6 text-left cursor-pointer" onClick={() => setActiveFaq(isOpen ? null : index)} aria-expanded={isOpen} data-testid={`faq-question-${index + 1}`}>
                      <span className="font-heading text-base font-bold tracking-[-0.02em] text-[#06216B] sm:text-lg">{question}</span>
                      <span className={`flex size-8 shrink-0 items-center justify-center rounded-full border border-[#DCE6F7] text-[#153D9F] transition-transform duration-300 ${isOpen ? "rotate-180 bg-[#EAF2FF]" : ""}`}>
                        <ChevronDown className="size-4" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                          <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-slate-600" data-testid={`faq-answer-${index + 1}`}>{answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#F8FAFC] py-20" data-testid="contact-section">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
            <Reveal>
              <p className="eyebrow">The next arrival</p>
              <h2 className="mt-3 font-heading text-3xl font-bold tracking-[-0.05em] text-[#06216B] sm:text-4xl" data-testid="contact-heading">Make every arrival more professional.</h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-600" data-testid="contact-copy">Give your visitors a better experience and your organisation better control with Digi-Gate.</p>
            </Reveal>
            <Button onClick={() => navigate("/scan")} size="lg" className="rounded-xl bg-[#06216B] px-7 font-bold shadow-lg shadow-[#06216B]/15 hover:-translate-y-1 hover:bg-[#153D9F] flex items-center gap-2" data-testid="contact-cta-scan">
              <QrCode className="size-5 text-[#8EE7FF]" /> Scan Gate QR
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-[#030C27] py-14 text-white" data-testid="footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
            <div>
              <LogoMark light testId="brand-logo-footer" />
              <p className="mt-5 max-w-xs text-sm leading-6 text-blue-100/60" data-testid="footer-tagline">Smart visitor management for modern organisations.</p>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8EB9FF]" data-testid="footer-positioning">A better welcome, every time.</p>
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#8EB9FF]">Explore</p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-blue-100/65">
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
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#8EB9FF]">Company</p>
              <div className="mt-5 flex flex-col gap-3 text-sm text-blue-100/65">
                <a href="#faq" className="transition-colors hover:text-white" data-testid="footer-link-faq">FAQ</a>
                <a href="#contact" className="transition-colors hover:text-white" data-testid="footer-link-contact">Contact</a>
                <a href="#security" className="transition-colors hover:text-white" data-testid="footer-link-trust">Trust & control</a>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#8EB9FF]">Ready when you are</p>
              <p className="mt-4 text-xs text-blue-100/60">Modernize your entrance today with Digi-Gate.</p>
              <Button onClick={() => navigate("/scan")} className="mt-4 rounded-xl bg-[#153D9F] hover:bg-[#06216B] text-white text-xs font-bold py-2.5 px-4 flex items-center gap-2">
                <QrCode className="size-4" /> Gate QR Scanner
              </Button>
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-100/50">
            <p>&copy; {new Date().getFullYear()} Digi-Gate. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 font-mono text-[10px] tracking-widest uppercase">Smart Visitor Management System</p>
          </div>
        </div>
      </footer>
      <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />
      <RegisterOrgModal open={registerOpen} onOpenChange={setRegisterOpen} />
    </div>
  );
}
