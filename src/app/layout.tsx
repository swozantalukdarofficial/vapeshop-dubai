import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";
import { CanonicalHead } from "@/components/layout/CanonicalHead";
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getLocalBusinessSchema,
  SITE_URL,
} from "@/lib/seo-schemas";

const playfair = Playfair_Display({
  variable: "--font-playfair",
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
    default: "Vape Shop Dubai | Premium Luxury Vape Store & 2-Hour Delivery",
    template: "%s | Vape Shop Dubai",
  },
  description: "Experience premium luxury vaping in Dubai. 2-Hour Express Delivery across Dubai, same-day Abu Dhabi & UAE. 100% authentic JUUL, Myle, Disposables & E-Liquids.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = getOrganizationSchema();
  const websiteSchema = getWebSiteSchema();
  const storeSchema = getLocalBusinessSchema();

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased overflow-x-hidden max-w-full`}
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
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200 overflow-x-hidden max-w-full w-full">
        <CanonicalHead />
        <ThemeProvider>
          <CartProvider>
            {children}
            <WhatsAppFloating />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
