import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeSettingsProvider } from "@/context/ThemeSettingsContext";
import { getThemeSettings } from "@/lib/theme/get-settings";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { CanonicalHead } from "@/components/layout/CanonicalHead";
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getLocalBusinessSchema,
  SITE_URL,
} from "@/lib/seo-schemas";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vape Shop Dubai | Juul, MYLE, Disposable Vapes & Pod Kits",
    template: "%s | Vape Shop Dubai",
  },
  description: "Shop a trusted Vape Shop Dubai for Juul, MYLE, disposable vapes, pod kits, and nicotine salts with same-day delivery and cash on delivery across the UAE.",
  keywords: [
    "Vape Shop Dubai",
    "Buy Vape UAE",
    "JUUL 2 Dubai",
    "Disposable Vape Dubai",
    "Myle Dubai",
    "Vape Delivery Dubai",
    "Al Fakher Crown Bar",
    "Pod Salt Dubai",
    "E-Juice Dubai"
  ],
  authors: [{ name: "Vape Shop Dubai" }],
  creator: "Vape Shop Dubai",
  publisher: "Vape Shop Dubai",
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Vape Shop Dubai",
    title: "Vape Shop Dubai | Premium Luxury Vape Store",
    description: "2-Hour Express Vape Delivery across Dubai. 100% authentic devices, pod kits, and e-liquids.",
    images: [
      {
        url: `${SITE_URL}/hero_vape.png`,
        width: 1200,
        height: 630,
        alt: "Vape Shop Dubai Luxury Pod Systems & Disposables",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vape Shop Dubai | Premium Luxury Vape Store",
    description: "2-Hour Express Vape Delivery across Dubai. 100% authentic devices, pod kits, and e-liquids.",
    images: [`${SITE_URL}/hero_vape.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();
  const storeSchema = getLocalBusinessSchema();
  const themeSettings = await getThemeSettings();

  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${inter.variable} h-full antialiased overflow-x-hidden max-w-full`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.shopify.com" />
        
        {/* Root Google JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200 overflow-x-hidden max-w-full w-full"
        suppressHydrationWarning
      >
        <CanonicalHead />
        <ThemeSettingsProvider initial={themeSettings}>
          <ThemeProvider>
            <CartProvider>
              {children}
              <WhatsAppFloating />
            </CartProvider>
          </ThemeProvider>
        </ThemeSettingsProvider>
      </body>
    </html>
  );
}
