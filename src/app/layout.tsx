import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { WhatsAppFloating } from "@/components/layout/WhatsAppFloating";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vape Shop Dubai | Premium Luxury Vape Store",
  description: "Experience premium luxury vaping in Dubai. Same-day delivery across Dubai, Abu Dhabi & UAE. 100% authentic devices, pod kits, and e-liquids.",
  keywords: ["Vape Shop Dubai", "Buy Vape UAE", "JUUL 2 Dubai", "Disposable Vape Dubai", "Myle Dubai", "Vape Delivery Dubai"],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem("vapeshope_theme");
                  if (savedTheme === "dark") {
                    document.documentElement.classList.add("dark");
                  } else if (savedTheme === "light") {
                    document.documentElement.classList.remove("dark");
                  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    document.documentElement.classList.add("dark");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
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
