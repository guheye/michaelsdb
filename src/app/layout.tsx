import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BRAND_DISPLAY } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BRAND_DISPLAY} — Intellectual Conservative News & Analysis`,
  description:
    "Reality-based conservative news aggregation with AI-reframed headlines. Ideas over tribes.",
  openGraph: {
    title: BRAND_DISPLAY,
    description:
      "Intellectual conservative news & analysis. Headlines curated by AI.",
    type: "website",
  },
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
