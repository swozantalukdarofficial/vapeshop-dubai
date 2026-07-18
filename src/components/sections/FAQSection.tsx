"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQ_SECTIONS = [
  {
    title: "Information About JUUL",
    faqs: [
      {
        question: "What is JUUL Vape?",
        answer: "JUUL is a compact, draw-activated pod vaping device designed as an alternative to traditional cigarettes. It uses pre-filled nicotine salt pods and is one of the most recognized vape brands globally. The JUUL device is sleek, discreet, and incredibly simple to use — no buttons, no settings.",
      },
      {
        question: "Where Can I Buy JUUL Pods in UAE?",
        answer: "You can buy authentic JUUL pods directly from Vape Shop Dubai. We stock both JUUL 1 (USA-made) and JUUL 2 (UK-made) pods across all available flavours including Virginia Tobacco, Menthol, Peach, Watermelon, Apple, and Arctic Breeze. Order online and get same-day delivery in Dubai.",
      },
      {
        question: "How many puffs should you take on a JUUL?",
        answer: "Each JUUL pod is equivalent to roughly 200 puffs or approximately one pack of cigarettes (20 cigarettes). The number of puffs varies depending on your draw length and frequency of use. For JUUL 2 pods, the puff count can vary slightly.",
      },
      {
        question: "Can I open or refill my JUUL 2 pod?",
        answer: "No — JUUL 2 pods are sealed, pre-filled, and not designed to be refilled. Attempting to open or refill them may damage the pod, the device, or lead to a compromised vaping experience. Always use official JUUL 2 pods to maintain safety and performance.",
      },
      {
        question: "How long does a JUUL battery last and how do I charge it?",
        answer: "A fully charged JUUL battery typically lasts for about a full day of moderate use, or roughly one full pod. To charge it, place the device on the magnetic USB charging dock. It takes about an hour to reach a full charge, indicated by a solid green light.",
      },
      {
        question: "What is so good about JUUL?",
        answer: "JUUL stands out for its simplicity, consistency, and nicotine satisfaction. The draw-activated design means no buttons or settings. The nicotine salt formulation delivers a smooth, satisfying hit similar to a traditional cigarette. It's one of the most recognized and trusted vaping platforms worldwide.",
      },
      {
        question: "Why are JUUL pods so popular?",
        answer: "JUUL pods are popular because they deliver consistent flavor and nicotine satisfaction with zero hassle. The closed pod system eliminates mess, the flavour range covers all major preferences, and the device is virtually maintenance-free. For people switching from cigarettes, it's the most familiar and reliable option available.",
      },
    ],
  },
  {
    title: "Information About MYLE",
    faqs: [
      {
        question: "What is MYLE Vape?",
        answer: "Myle is a UAE-favorite pod system built around salt nicotine technology. It delivers a smooth, cigarette-like draw in a slim, pocket-friendly device available in a wide range of flavors. Originally developed for the MENA market, Myle has become one of the most recognized pod vape brands across the UAE.",
      },
      {
        question: "How long does a MYLE pod last?",
        answer: "A standard MYLE pod typically lasts between 250 to 320 puffs, depending on your draw length and frequency. This is roughly equivalent to one pack of cigarettes. Heavier users may find pods lasting 1-2 days, while lighter users can expect 2-3 days per pod.",
      },
      {
        question: "Where Can I Buy Myle Vape in Dubai?",
        answer: "Vape Shop Dubai stocks the complete MYLE lineup. Order online through our website and get same-day delivery anywhere in Dubai. We also deliver to Abu Dhabi, Sharjah, Ajman, and all UAE emirates. All products are sourced through authorized distributors.",
      },
      {
        question: "How do I know when my MYLE disposable vape is fully charged?",
        answer: "Most MYLE disposable devices feature an LED indicator light. The light typically changes from red (charging) to white or green (fully charged). Charging usually takes 30–60 minutes via the included USB-C cable.",
      },
      {
        question: "How long does the MYLE device last?",
        answer: "The MYLE device (non-disposable) can last 1-2 years with proper care. The built-in battery holds charge well, and the pod connection rarely wears out with normal use. Avoid dropping the device and keep the pod connection clean for maximum longevity.",
      },
      {
        question: "Can you refill a disposable MYLE?",
        answer: "No — MYLE disposables are designed as single-use devices. They are sealed units that cannot be safely refilled. Once the e-liquid is depleted or the battery runs out, the device should be properly disposed of. Attempting to refill may damage the device.",
      },
      {
        question: "What are the health risks associated with vaping?",
        answer: "Vaping is not risk-free. Products containing nicotine are addictive. E-cigarettes are not recommended for non-smokers, persons under 21, pregnant or breastfeeding women, or those with heart conditions or high blood pressure. While generally considered less harmful than traditional cigarettes, long-term health effects are still being studied.",
      },
    ],
  },
];

export const FAQSection: React.FC = () => {
  const [open, setOpen] = useState<string | null>("JUUL Vape-0");

  const toggle = (key: string) => setOpen(open === key ? null : key);

  return (
    <div id="faqs" className="scroll-mt-24 bg-card/70 backdrop-blur-md border border-border/40 rounded-[2.5rem] p-8 sm:p-12 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 relative overflow-hidden">
      {/* Subtle top decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />

      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-[9px] font-bold tracking-[0.25em] text-primary uppercase mb-1">F.A.Q.</p>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground tracking-wide">JUUL & MYLE Guide</h2>
        {/* Premium Divider */}
        <div className="flex items-center justify-center gap-2 mt-2 mb-3">
          <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-primary/65" />
          <div className="w-1.5 h-1.5 rotate-45 border border-primary/40 bg-primary/10" />
          <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-primary/65" />
        </div>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Everything you need to know about UAE's top pod systems, authenticity checks, and delivery.
        </p>
      </div>

      {/* FAQs columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {FAQ_SECTIONS.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-4">
            <h3 className="text-base font-bold text-foreground tracking-wide border-b border-border/25 pb-2 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {group.title}
            </h3>
            <div className="space-y-3">
              {group.faqs.map((faq, idx) => {
                const uniqueKey = `${group.title}-${idx}`;
                const isOpen = open === uniqueKey;
                return (
                  <div
                    key={idx}
                    className="border border-border/30 rounded-2xl overflow-hidden bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    <button
                      onClick={() => toggle(uniqueKey)}
                      className="w-full text-left p-4 flex justify-between items-center gap-4 cursor-pointer"
                    >
                      <span className="text-xs font-bold text-foreground leading-snug">{faq.question}</span>
                      <span className={`text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                        ▼
                      </span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-[300px] border-t border-border/10 p-4 bg-muted/20" : "max-h-0"
                      }`}
                    >
                      <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp CTA */}
      <div className="mt-14 relative overflow-hidden bg-card/60 backdrop-blur-md border border-border/40 rounded-[2.2rem] p-8 sm:p-12 text-center shadow-[var(--shadow-card)] hover:shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] transition-all duration-300">
        {/* Subtle radial emerald/gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-20 bg-emerald-500/10 rounded-full filter blur-[40px] pointer-events-none" />

        <span className="text-[9px] font-bold tracking-[0.25em] text-emerald-500 uppercase mb-2 block">
          Fast Assistance
        </span>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-2">
          Still have questions?
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
          Chat with our support team on WhatsApp — we reply within minutes, 7 days a week.
        </p>
        <a
          href="https://wa.me/971582839787?text=Hello, I have a question about Vape Shop Dubai!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-[0_4px_20px_-4px_rgba(16,185,129,0.4)] hover:shadow-[0_4px_25px_-2px_rgba(16,185,129,0.5)] active:scale-95 transition-all cursor-pointer"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.01 14.069.99 11.45.99c-5.438 0-9.863 4.37-9.868 9.8-.001 1.77.463 3.5 1.34 5.013l-1.01 3.693 3.795-.983zm11.567-7.64c-.093-.154-.34-.247-.714-.433-.371-.186-2.197-1.083-2.537-1.206-.34-.124-.588-.186-.834.186-.247.371-.958 1.206-1.174 1.452-.216.247-.433.278-.805.093-.371-.186-1.568-.578-2.986-1.843-1.103-.983-1.847-2.197-2.063-2.568-.216-.371-.023-.571.163-.756.168-.167.371-.433.557-.65.186-.216.247-.371.371-.619.124-.247.062-.463-.031-.65-.093-.186-.834-2.01-1.144-2.759-.303-.729-.61-1.05-.834-1.062-.216-.013-.463-.013-.711-.013-.247 0-.65.093-.99.463-.34.371-1.3 1.269-1.3 3.094s1.33 3.589 1.515 3.837c.186.247 2.617 3.997 6.34 5.61 3.722 1.612 3.722 1.075 4.39.998.67-.077 2.197-.897 2.507-1.763.31-.866.31-1.609.216-1.763z"/>
          </svg>
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
};
