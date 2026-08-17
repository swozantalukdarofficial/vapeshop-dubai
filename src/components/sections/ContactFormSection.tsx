"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

export interface ContactFormSettings {
  heading: string;
  description: string;
  nameLabel: string;
  phoneLabel: string;
  orderIdLabel: string;
  subjectLabel: string;
  messageLabel: string;
  submitLabel: string;
  successMessage: string;
}

/** Posts to `/api/contact`, whose handler expects these five fields. */
export const ContactFormSection: React.FC<{ settings: ContactFormSettings }> = ({
  settings,
}) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    orderId: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not send your message.");
      }
      setStatus("sent");
      setForm({ name: "", phone: "", orderId: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
  const labelClass =
    "block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5";

  if (status === "sent") {
    return (
      <div className="w-full bg-card border border-border/60 rounded-[2rem] p-8 sm:p-12 text-center shadow-md">
        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        <p className="mt-4 text-lg font-serif font-black text-foreground">
          {settings.successMessage}
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-xs font-extrabold uppercase tracking-wider text-primary underline cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-card border border-border/60 rounded-[2rem] p-5 sm:p-7 lg:p-8 shadow-md">
      {(settings.heading || settings.description) && (
        <div className="mb-6 pb-5 border-b border-border/40 space-y-2">
          {settings.heading && (
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-foreground tracking-tight">
              {settings.heading}
            </h2>
          )}
          {settings.description && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {settings.description}
            </p>
          )}
        </div>
      )}

      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className={labelClass}>{settings.nameLabel}</label>
          <input
            id="cf-name"
            required
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className={labelClass}>{settings.phoneLabel}</label>
          <input
            id="cf-phone"
            required
            className={inputClass}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="cf-order" className={labelClass}>{settings.orderIdLabel}</label>
          <input
            id="cf-order"
            className={inputClass}
            value={form.orderId}
            onChange={(e) => setForm({ ...form, orderId: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="cf-subject" className={labelClass}>{settings.subjectLabel}</label>
          <input
            id="cf-subject"
            required
            className={inputClass}
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className={labelClass}>{settings.messageLabel}</label>
          <textarea
            id="cf-message"
            required
            rows={5}
            className={`${inputClass} resize-y`}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </div>

        {error && (
          <p className="sm:col-span-2 text-xs font-bold text-red-600">{error}</p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-gold-shimmer text-white font-extrabold text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {status === "sending" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {status === "sending" ? "Sending…" : settings.submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};
