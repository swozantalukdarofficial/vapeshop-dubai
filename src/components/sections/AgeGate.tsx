"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";

export const AgeGate: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem("vapedubai_age_verified");
    if (!verified) {
      setShowModal(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem("vapedubai_age_verified", "true");
    setShowModal(false);
  };

  const handleDeny = () => {
    // Redirect underage users to google
    window.location.href = "https://www.google.com";
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/95 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-lg shadow-2xl text-center space-y-6 animate-in scale-in duration-300">
        
        {/* Warning Icon */}
        <div className="inline-flex p-4 bg-gold/10 rounded-full text-gold">
          <ShieldAlert className="h-12 w-12 stroke-[1.5]" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-wider text-foreground">
            AGE VERIFICATION
          </h2>
          <p className="text-xs uppercase tracking-widest text-gold font-mono font-semibold">
            Vape Shop Dubai Delivery
          </p>
          <div className="h-px w-16 bg-gold/30 mx-auto my-3" />
          <p className="text-xs text-text-muted leading-relaxed">
            You must be <span className="text-foreground font-bold">21 years of age or older</span> to view and purchase products from this store. ID check is mandatory at the time of delivery.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleVerify}
            className="flex-1 bg-gold hover:bg-gold-shimmer text-primary-foreground py-3 rounded text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none cursor-pointer"
          >
            I am 21 or Older
          </button>
          <button
            onClick={handleDeny}
            className="flex-1 bg-transparent hover:bg-muted border border-border text-foreground/80 py-3 rounded text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none cursor-pointer"
          >
            I am Under 21
          </button>
        </div>

        <p className="text-[10px] text-text-muted">
          By entering, you agree to our Terms of Service and verify your local region regulations allow vaping products.
        </p>

      </div>
    </div>
  );
};
