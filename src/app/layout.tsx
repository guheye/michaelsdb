import type { Metadata, Viewport } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BRAND_DISPLAY } from "@/lib/brand";
import { ICON_BG } from "@/lib/icon-monogram";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BRAND_DISPLAY} — Intellectual Conservative News & Analysis`,
  description:
    "Reality-based conservative news aggregation with AI-reframed headlines. Ideas over tribes.",
  applicationName: BRAND_DISPLAY,
  appleWebApp: {
    title: BRAND_DISPLAY,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: BRAND_DISPLAY,
    description:
      "Intellectual conservative news & analysis. Headlines curated by AI.",
    type: "website",
  },
  other: {
    "msapplication-TileColor": ICON_BG,
  },
};

export const viewport: Viewport = {
  themeColor: ICON_BG,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-white text-gray-900">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
