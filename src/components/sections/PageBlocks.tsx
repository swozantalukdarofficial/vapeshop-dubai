"use client";

import React from "react";
import { Clock, Mail, MapPin, Phone, ChevronDown, ChevronUp } from "lucide-react";

import { ThemeIcon } from "@/components/ui/theme-icon";

/**
 * Generic building blocks for static pages (About, Contact, Terms…), where the
 * content is copy rather than commerce data.
 */

/* ── Page header ──────────────────────────────────────────────────── */

export interface PageHeaderSettings {
  eyebrow: string;
  heading: string;
  subheading: string;
  centered: boolean;
}

export const PageHeaderSection: React.FC<{ settings: PageHeaderSettings }> = ({
  settings,
}) => (
  <header
    className={`w-full ${settings.centered ? "text-center" : "text-left"}`}
  >
    {settings.eyebrow && (
      <span className="text-xs font-extrabold tracking-[0.25em] text-primary uppercase">
        {settings.eyebrow}
      </span>
    )}
    <h1 className="mt-1.5 text-3xl sm:text-5xl font-serif font-black text-foreground tracking-tight leading-[1.1]">
      {settings.heading}
    </h1>
    {settings.subheading && (
      <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
        {settings.subheading}
      </p>
    )}
    {settings.centered && (
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-primary/65" />
        <div className="w-1.5 h-1.5 rotate-45 border border-primary/40 bg-primary/10" />
        <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-primary/65" />
      </div>
    )}
  </header>
);

/* ── Rich text ────────────────────────────────────────────────────── */

export interface RichTextSettings {
  heading: string;
  body: string;
  width: "narrow" | "wide";
  collapsible?: boolean;
}

function parseInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

/**
 * Renders plain text as paragraphs and bullet lists.
 *
 * Deliberately not HTML: merchant copy is inserted as text nodes, so nothing
 * typed into the admin can inject markup or script into the storefront.
 * Blank lines separate blocks; lines starting with "- " become list items.
 */
function renderBody(body: string): React.ReactNode[] {
  return body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, idx) => {
      const lines = block.split("\n").map((l) => l.trim());
      
      if (lines.length === 1 && lines[0].startsWith("### ")) {
        return (
          <h3 key={idx} className="text-xl sm:text-2xl font-serif font-black text-foreground tracking-tight mt-10 mb-4">
            {parseInline(lines[0].slice(4))}
          </h3>
        );
      }

      const isList = lines.every((line) => line.startsWith("- "));

      if (isList) {
        return (
          <ul key={idx} className="space-y-2 pl-1 mb-4">
            {lines.map((line, i) => (
              <li key={i} className="flex gap-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{parseInline(line.slice(2))}</span>
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={idx} className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
          {parseInline(block)}
        </p>
      );
    });
}

export const RichTextSection: React.FC<{ settings: RichTextSettings }> = ({
  settings,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const isCollapsible = settings.collapsible === true;

  if (!settings.heading && !settings.body.trim()) return null;

  return (
    <div className="w-full relative group my-4">
      {/* Premium Gradient Glow backdrop */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-orange-500/20 to-primary/30 rounded-[2.5rem] blur-xl opacity-70 transition-all duration-700 group-hover:opacity-100 group-hover:blur-2xl" />
      
      <div className="relative w-full bg-card/80 backdrop-blur-2xl border border-primary/20 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
        
        {/* Futuristic Background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className={`relative z-10 ${settings.width === "narrow" ? "max-w-4xl mx-auto" : "w-full"}`}>
          {settings.heading && (
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-primary" />
              <h2 className="text-3xl sm:text-4xl font-serif font-black text-foreground tracking-tight text-center bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                {settings.heading}
              </h2>
              <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-primary" />
            </div>
          )}
          
          <div className={`relative transition-all duration-700 ease-in-out ${isCollapsible && !expanded ? "max-h-[220px] overflow-hidden" : ""}`}>
            <div className="space-y-3 pb-4 text-base sm:text-lg leading-relaxed">{renderBody(settings.body)}</div>
            
            {/* Elegant gradient fade for collapsed state */}
            {isCollapsible && !expanded && (
              <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-card via-card/90 to-transparent pointer-events-none" />
            )}
          </div>
          
          {isCollapsible && (
            <div className="mt-8 flex justify-center relative z-20">
              <button
                onClick={() => setExpanded(!expanded)}
                className="group/btn relative inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-primary via-orange-500 to-primary bg-[length:200%_auto] px-9 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/30 transition-all duration-300 hover:shadow-primary/50 hover:scale-105 active:scale-95"
              >
                {expanded ? (
                  <>
                    <span>Show Less</span>
                    <ChevronUp className="w-4 h-4 transition-transform group-hover/btn:-translate-y-1" />
                  </>
                ) : (
                  <>
                    <span>Read Full Story</span>
                    <ChevronDown className="w-4 h-4 transition-transform group-hover/btn:translate-y-1" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Feature grid ─────────────────────────────────────────────────── */

export interface FeatureGridSettings {
  heading: string;
  description: string;
  items: { icon: string; title: string; body: string }[];
}

export const FeatureGridSection: React.FC<{ settings: FeatureGridSettings }> = ({
  settings,
}) => {
  if (settings.items.length === 0) return null;

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {settings.items.map((item, idx) => (
          <div
            key={idx}
            className="group bg-card border border-border/70 hover:border-primary/60 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="w-11 h-11 rounded-xl border p-2 flex items-center justify-center bg-primary/10 text-primary border-primary/20 mb-4">
              <ThemeIcon name={item.icon} className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-black text-foreground group-hover:text-primary transition-colors leading-snug">
              {item.title}
            </h3>
            {item.body && (
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {item.body}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Contact details ──────────────────────────────────────────────── */

export interface ContactDetailsSettings {
  heading: string;
  addressLabel: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapEmbedUrl: string;
}

export const ContactDetailsSection: React.FC<{
  settings: ContactDetailsSettings;
}> = ({ settings }) => (
  <div className="w-full bg-card border border-border/60 rounded-[2rem] p-5 sm:p-7 lg:p-8 shadow-md">
    {settings.heading && (
      <h2 className="text-2xl sm:text-3xl font-serif font-black text-foreground tracking-tight mb-6 pb-5 border-b border-border/40">
        {settings.heading}
      </h2>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <ul className="space-y-4">
        {settings.address && (
          <li className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span className="text-sm text-muted-foreground leading-relaxed">
              {settings.addressLabel && (
                <strong className="block text-foreground font-bold text-xs uppercase tracking-wider mb-0.5">
                  {settings.addressLabel}
                </strong>
              )}
              {settings.address}
            </span>
          </li>
        )}
        {settings.phone && (
          <li className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary shrink-0" />
            <a
              href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              {settings.phone}
            </a>
          </li>
        )}
        {settings.email && (
          <li className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary shrink-0" />
            <a
              href={`mailto:${settings.email}`}
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors break-all"
            >
              {settings.email}
            </a>
          </li>
        )}
        {settings.hours && (
          <li className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-emerald-500 shrink-0" />
            <span className="text-sm text-muted-foreground font-medium">
              {settings.hours}
            </span>
          </li>
        )}
      </ul>

      {settings.mapEmbedUrl && (
        <div className="overflow-hidden rounded-2xl border border-border/60 min-h-[240px]">
          <iframe
            src={settings.mapEmbedUrl}
            title="Store location"
            className="h-full w-full min-h-[240px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  </div>
);
