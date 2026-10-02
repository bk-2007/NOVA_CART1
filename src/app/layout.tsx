import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { CartographyHeader, PersonaProvider } from "@/components/CartographyHeader";

export const metadata: Metadata = {
  title: "NOVA CART — Local Commerce Intelligence",
  description:
    "Production-grade operational intelligence platform diagnosing hyperlocal inventory degradation, fulfillment failure, and customer churn for 620 partner stores.",
  authors: [{ name: "Nova Cart Engineering & Product Architecture Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cartography text-ink flex flex-col font-sans selection:bg-ink selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-ink focus:text-editorial-white focus:outline-2 focus:outline-ink focus:shadow-md text-xs font-medium"
        >
          Skip to main content
        </a>
        <PersonaProvider>
          <CartographyHeader />
          <div className="flex flex-1 flex-col lg:flex-row w-full min-h-[calc(100vh-38px)]">
            <Navigation />
            <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto w-full focus:outline-none">
              {children}
            </main>
          </div>
        </PersonaProvider>
      </body>
    </html>
  );
}
