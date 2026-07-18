"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, ShieldCheck } from "lucide-react";

export const WhatsAppFloating: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [message, setMessage] = useState("");
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show tooltip after 4 seconds to catch attention if not already open
    const timer = setTimeout(() => {
      if (!isOpen) setShowTooltip(true);
    }, 4000);

    // Auto-hide tooltip after 12 seconds
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 12000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [isOpen]);

  // Close dashboard when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dashboardRef.current && !dashboardRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest(".whatsapp-floating-btn")) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = (textToSend?: string) => {
    const finalMsg = textToSend || message;
    if (!finalMsg.trim()) return;

    const encodedMsg = encodeURIComponent(finalMsg);
    const whatsappUrl = `https://wa.me/971582839787?text=${encodedMsg}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    
    // Clear input if sending custom message
    if (!textToSend) setMessage("");
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const quickQuestions = [
    { text: "🚚 Delivery time & cost?", msg: "Hello! Can you tell me about the delivery time and cost in Dubai/UAE?" },
    { text: "⚡ Is JUUL 2 in stock?", msg: "Hello! I want to check the availability and flavors for JUUL 2 pods." },
    { text: "💵 Cash on delivery available?", msg: "Hello! Do you support Cash on Delivery (COD) for vapes?" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* ── Chat Dashboard Card ── */}
      {isOpen && (
        <div
          ref={dashboardRef}
          className="mb-4 w-[320px] sm:w-[350px] bg-[#121214]/95 border border-white/5 rounded-[1.8rem] shadow-[0_15px_50px_rgba(0,0,0,0.4)] backdrop-blur-md overflow-hidden flex flex-col animate-slide-up origin-bottom-right"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-gold-shimmer p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden">
                  <span className="text-xl">💨</span>
                </div>
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-primary animate-pulse" />
              </div>
              <div>
                <h4 className="font-semibold text-xs sm:text-sm tracking-wide">Vape Shop Dubai</h4>
                <p className="text-[10px] text-white/75 flex items-center gap-1">
                  Active Now • Replies in minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Chat content area */}
          <div className="p-5 flex-grow space-y-4 max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {/* Greeting */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs flex-shrink-0">
                👤
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none p-3.5 max-w-[85%]">
                <p className="text-xs text-zinc-200 leading-relaxed">
                  Hey there! 👋 Welcome to **Vape Shop Dubai**. How can we help you today?
                </p>
                <div className="flex items-center gap-1 mt-1 text-[9px] text-primary font-semibold">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  100% Authentic Products
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="space-y-2 pt-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
                Frequently Asked
              </p>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q.msg)}
                  className="w-full text-left bg-white/5 hover:bg-primary/10 border border-white/5 hover:border-primary/20 rounded-xl px-3.5 py-2.5 text-xs text-zinc-300 hover:text-primary transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span>{q.text}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px]">⚡</span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer input area */}
          <div className="p-4 border-t border-white/5 bg-zinc-950/40 flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a question..."
              className="flex-grow bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary/40 transition-colors"
            />
            <button
              onClick={() => handleSend()}
              disabled={!message.trim()}
              className="w-9 h-9 rounded-xl bg-primary hover:bg-gold-shimmer disabled:bg-zinc-800 disabled:text-zinc-500 text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Launcher Trigger Button ── */}
      <div className="flex items-center gap-3">
        {/* Tooltip badge */}
        {!isOpen && (
          <div
            className={`bg-zinc-950/90 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm transition-all duration-300 transform origin-right ${
              showTooltip ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-4 scale-75 pointer-events-none"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Chat with us!
            </span>
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTooltip(false);
          }}
          className="whatsapp-floating-btn relative w-14 h-14 rounded-full bg-primary hover:bg-gold-shimmer text-white flex items-center justify-center shadow-[0_4px_20px_rgba(232,82,26,0.35)] hover:shadow-[0_4px_25px_rgba(232,82,26,0.5)] hover:scale-[1.07] active:scale-95 transition-all duration-300 cursor-pointer group"
          aria-label="Toggle live chat"
        >
          {/* Pulsing outer ring */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full border-2 border-primary/25 animate-ping pointer-events-none" />
          )}

          {/* Message or Close Icon */}
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
          ) : (
            <MessageSquare className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          )}

          {/* Pulse Notification dot (only if closed) */}
          {!isOpen && (
            <span className="absolute top-0.5 right-0.5 block h-3 w-3 rounded-full ring-2 ring-primary bg-emerald-500" />
          )}
        </button>
      </div>
    </div>
  );
};
