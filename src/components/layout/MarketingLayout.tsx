import type { ReactNode } from "react";
import { MarketingHeader } from "./MarketingHeader";
import { MarketingFooter } from "./MarketingFooter";

export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F6] text-[#172525] w-full">
      <MarketingHeader />
      <main className="flex-1 pt-[68px] sm:pt-[76px] w-full">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
