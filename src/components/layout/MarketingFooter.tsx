import { Link, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "./MarketingHeader";

export function MarketingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#011f1e] py-8 sm:py-10 text-white" data-testid="footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <LogoMark light testId="brand-logo-footer" />
            <p className="mt-3 max-w-xs text-xs sm:text-sm leading-6 text-teal-100/65" data-testid="footer-tagline">
              Smart visitor management for modern organisations.
            </p>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[#F3E8BC]" data-testid="footer-positioning">
              A better welcome, every time.
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3E8BC]">Explore</p>
            <div className="mt-3 flex flex-col gap-2 text-xs sm:text-sm text-teal-100/70">
              <Link to="/why-digi-gate" className="transition-colors hover:text-white" data-testid="footer-link-why">Why Digi-Gate</Link>
              <Link to="/benefits" className="transition-colors hover:text-white" data-testid="footer-link-benefits">Benefits</Link>
              <Link to="/how-it-works" className="transition-colors hover:text-white" data-testid="footer-link-how-it-works">How It Works</Link>
              <Link to="/solutions" className="transition-colors hover:text-white" data-testid="footer-link-solutions">Solutions</Link>
              <Link to="/security" className="transition-colors hover:text-white" data-testid="footer-link-security">Security & Control</Link>
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3E8BC]">Company</p>
            <div className="mt-3 flex flex-col gap-2 text-xs sm:text-sm text-teal-100/70">
              <Link to="/register" className="transition-colors hover:text-white font-semibold text-white" data-testid="footer-link-register">Register Business</Link>
              <Link to="/faq" className="transition-colors hover:text-white" data-testid="footer-link-faq">FAQ</Link>
              <Link to="/security" className="transition-colors hover:text-white" data-testid="footer-link-trust">Trust & Control</Link>
              <Link to="/register" className="transition-colors hover:text-white" data-testid="footer-link-contact">Contact Sales</Link>
            </div>
          </div>
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3E8BC]">Ready when you are</p>
            <p className="mt-2 text-xs text-teal-100/65">Modernize your entrance today with Digi-Gate.</p>
            <div className="mt-3 flex flex-col gap-2">
              <Button onClick={() => navigate("/register")} className="h-9 rounded-full bg-white text-[#035352] hover:bg-[#F3E8BC] text-xs font-bold px-4 flex items-center gap-2 transition-colors cursor-pointer">
                <Building2 className="size-3.5 text-[#05706f]" /> Business Registration
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-teal-100/50">
          <p>&copy; {new Date().getFullYear()} Digi-Gate. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[10px] tracking-widest uppercase">Smart Visitor Management System</p>
        </div>
      </div>
    </footer>
  );
}
