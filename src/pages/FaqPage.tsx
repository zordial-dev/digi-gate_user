import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, HelpCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingLayout } from "@/components/layout/MarketingLayout";

const faqCategories = [
  {
    category: "General & Overview",
    questions: [
      {
        q: "What is Digi-Gate?",
        a: "Digi-Gate is a modern cloud visitor management solution that replaces traditional paper registers with contactless QR check-ins, automated host alerts, and secure digital entrance passes.",
      },
      {
        q: "Who is Digi-Gate designed for?",
        a: "Digi-Gate is built for corporate offices, business parks, educational institutions, healthcare facilities, co-working hubs, and gated communities of any size.",
      },
      {
        q: "Do visitors need to install a mobile app?",
        a: "No. Visitors simply scan your entrance QR code with their default phone camera. The lightweight check-in form opens immediately in their mobile browser without downloading any apps.",
      },
    ],
  },
  {
    category: "Setup & Hardware",
    questions: [
      {
        q: "Do we need to buy expensive kiosk hardware or badge printers?",
        a: "No proprietary hardware is required. Digi-Gate operates entirely on standard QR codes and smartphones. You can also run it on reception tablets if you prefer a dedicated front-desk kiosk.",
      },
      {
        q: "How fast is the setup process?",
        a: "Setup takes under 5 minutes. Register your organisation, configure your departments, and print your customized gate QR code poster to start receiving visitors immediately.",
      },
      {
        q: "Can we support multiple gates or multiple office locations?",
        a: "Yes. Digi-Gate natively supports multi-gate and multi-location setups with unique QR codes for each checkpoint under one central management dashboard.",
      },
    ],
  },
  {
    category: "Host Alerts & Notifications",
    questions: [
      {
        q: "How do hosts receive arrival alerts?",
        a: "Hosts receive instant real-time notifications via WhatsApp, SMS, and dashboard alerts with the visitor's name, photo, and purpose of visit.",
      },
      {
        q: "Can hosts pre-register expected visitors in advance?",
        a: "Yes. Hosts can generate pre-approved VIP invite links and send them to expected visitors before the meeting, allowing visitors to breeze through reception in 5 seconds.",
      },
    ],
  },
  {
    category: "Security, Privacy & Compliance",
    questions: [
      {
        q: "How does Digi-Gate protect visitor privacy?",
        a: "Unlike physical logbooks where visitors can view previous guests' private contact info, Digi-Gate provides 100% confidential check-in. All data is encrypted with TLS 1.3 and AES-256.",
      },
      {
        q: "Can we configure automatic data retention rules for GDPR compliance?",
        a: "Yes. Administrators can set automatic data purging intervals (e.g. 30, 90, 180, or 365 days) according to their company's data protection and compliance guidelines.",
      },
      {
        q: "Can security guards verify digital entrance passes?",
        a: "Yes. Each visitor pass displays an encrypted QR token, visitor photo, timestamp, host details, and access approval status that guards can verify visually or by scanning.",
      },
    ],
  },
];

export default function FaqPage() {
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "0-0": true });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <MarketingLayout>
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div className="max-w-3xl">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#05706f] bg-[#e6f0f0] px-3 py-1 rounded-full">
              Frequently Asked Questions
            </span>
            <h1 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#172525] leading-tight">
              Everything you need to know about <span className="text-[#035352] underline decoration-[#F3E8BC] decoration-4 underline-offset-8">Digi-Gate</span>.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#4a5d5c] leading-relaxed">
              Find instant answers to common questions about features, setup, notifications, hardware, and privacy.
            </p>
          </div>

          {/* Categorized FAQs */}
          <div className="mt-12 space-y-10">
            {faqCategories.map((cat, catIdx) => (
              <div key={cat.category} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
                  <HelpCircle className="size-5 text-[#05706f]" />
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-[#172525]">
                    {cat.category}
                  </h2>
                </div>

                <div className="mt-4 divide-y divide-slate-100">
                  {cat.questions.map((item, qIdx) => {
                    const key = `${catIdx}-${qIdx}`;
                    const isOpen = !!openItems[key];
                    return (
                      <div key={item.q} className="py-3.5 sm:py-4">
                        <button
                          onClick={() => toggleItem(key)}
                          className="flex w-full items-center justify-between gap-4 text-left cursor-pointer group"
                        >
                          <span className="font-heading text-sm sm:text-base font-bold text-[#172525] group-hover:text-[#035352] transition-colors">
                            {item.q}
                          </span>
                          <span
                            className={`flex size-6 shrink-0 items-center justify-center rounded-full border border-slate-200 text-[#035352] transition-transform duration-300 ${
                              isOpen ? "rotate-180 bg-[#e6f0f0]" : ""
                            }`}
                          >
                            <ChevronDown className="size-3.5" />
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <p className="mt-2.5 max-w-3xl pr-6 text-xs sm:text-sm leading-relaxed text-[#4a5d5c]">
                                {item.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Still Have Questions CTA */}
          <div className="mt-12 rounded-3xl bg-[#035352] p-6 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#F3E8BC] text-xs font-bold uppercase tracking-wider font-mono">
                <MessageSquare className="size-4" /> Dedicated Support
              </div>
              <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold">Still have questions?</h2>
              <p className="mt-1 text-xs sm:text-sm text-teal-100/80">
                Our support team is available 24/7 to help you configure your system.
              </p>
            </div>
            <Button
              onClick={() => navigate("/register")}
              className="h-11 rounded-full bg-[#F3E8BC] hover:bg-[#e8da9d] px-7 text-xs font-bold text-[#035352] cursor-pointer shrink-0 shadow-lg"
            >
              Get Started with Digi-Gate <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
