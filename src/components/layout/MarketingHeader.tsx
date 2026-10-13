import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Building2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const navItems = [
  { label: "Why Digi-Gate", href: "/why-digi-gate", testId: "nav-link-why-digi-gate" },
  { label: "Benefits", href: "/benefits", testId: "nav-link-benefits" },
  { label: "How It Works", href: "/how-it-works", testId: "nav-link-how-it-works" },
  { label: "Solutions", href: "/solutions", testId: "nav-link-solutions" },
  { label: "Security", href: "/security", testId: "nav-link-security" },
  { label: "FAQ", href: "/faq", testId: "nav-link-faq" },
] as const;

export function LogoMark({ light = false, testId }: { light?: boolean; testId: string }) {
  return (
    <span className="flex items-center gap-2.5" data-testid={testId}>
      <img
        src="/digigate_logo.png"
        alt="DigiGate Logo"
        className="h-9 sm:h-10 w-auto object-contain rounded-md"
      />
      <div className="flex flex-col text-left">
        <span className={`font-heading text-lg sm:text-xl font-black tracking-tight leading-none ${light ? "text-white" : "text-[#035352]"}`}>
          Digi<span className={light ? "text-[#F3E8BC]" : "text-[#05706f]"}>-Gate</span>
        </span>
        <span className={`text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest leading-none mt-1 ${light ? "text-teal-200" : "text-[#035352]/70"}`}>
          Visitor System
        </span>
      </div>
    </span>
  );
}

export function MarketingHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white border-b border-slate-200/90 transition-all duration-300 ${
        scrolled ? "shadow-md shadow-[#035352]/10" : "shadow-sm"
      }`}
      data-testid="nav-bar"
    >
      <div className="mx-auto flex h-[68px] sm:h-[76px] max-w-7xl items-center justify-between px-3.5 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Digi-Gate home" data-testid="nav-brand-link">
          <LogoMark testId="brand-logo-header" />
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Primary navigation" data-testid="desktop-navigation">
          {navItems.map(({ label, href, testId }) => {
            const isActive = location.pathname === href;
            return (
              <Link
                key={href}
                to={href}
                className={`relative px-3.5 py-2 text-sm font-semibold rounded-full transition-all ${
                  isActive
                    ? "text-[#035352] bg-[#e6f0f0] font-bold"
                    : "text-[#4a5d5c] hover:text-[#035352] hover:bg-slate-100/70"
                }`}
                data-testid={testId}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            onClick={() => navigate("/register")}
            className="h-10 rounded-full bg-[#035352] px-6 text-xs font-bold text-white shadow-md shadow-[#035352]/20 hover:bg-[#023e3d] hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            data-testid="nav-cta-register-business"
          >
            <Building2 className="size-4 text-[#F3E8BC]" /> Register Business
          </Button>
        </div>

        <button
          className="flex size-10 items-center justify-center rounded-xl bg-[#035352] text-white shadow-sm hover:bg-[#023e3d] active:scale-95 transition-all lg:hidden cursor-pointer"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-label="Toggle navigation"
          data-testid="mobile-menu-toggle-button"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 bg-white px-5 py-5 lg:hidden overflow-hidden"
            aria-label="Mobile navigation"
            data-testid="mobile-navigation"
          >
            <div className="flex flex-col gap-1">
              {navItems.map(({ label, href, testId }) => {
                const isActive = location.pathname === href;
                return (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-[#035352] text-white font-bold"
                        : "text-[#4a5d5c] hover:bg-[#e6f0f0] hover:text-[#035352]"
                    }`}
                    data-testid={`${testId}-mobile`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4">
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/register");
                }}
                className="w-full h-11 rounded-full bg-[#035352] font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
                data-testid="nav-cta-register-business-mobile"
              >
                <Building2 className="size-4 text-[#F3E8BC]" /> Register Business
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
