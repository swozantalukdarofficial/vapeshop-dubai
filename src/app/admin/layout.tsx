import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Theme Customizer",
  robots: { index: false, follow: false },
};

/**
 * The admin sits inside the root layout (so it inherits fonts and globals.css)
 * but deliberately renders none of the storefront chrome. Its own light UI
 * palette is defined with plain slate/orange utilities rather than the theme
 * tokens, so restyling the storefront can never make the admin unusable.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-slate-100 text-slate-900" suppressHydrationWarning>{children}</div>;
}
