import type { Metadata } from "next";
import { Exo_2, DM_Sans, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { getServerLocale } from "@/lib/i18n/server";

// Display headings (matches the Figma). Exo 2 covers Cyrillic for Ukrainian.
const exo2 = Exo_2({
  variable: "--font-display",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

// Body text (matches the Figma). Inter is the Cyrillic fallback (DM Sans has no Cyrillic).
const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexTechPro — Phones, Laptops, Gaming & Tech in Ukraine",
  description:
    "Modern tech store for phones, laptops, gaming gear and accessories. Fast Nova Poshta & Meest delivery, flexible payment, official warranty.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerLocale();

  return (
    <html
      lang={locale}
      className={`${exo2.variable} ${dmSans.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <Providers initialLocale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
