import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildDefaultMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildDefaultMetadata(settings);
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const lang = settings?.defaultLanguage ?? "en";

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900`}
        suppressHydrationWarning
      >
        <div className="flex min-h-screen flex-col">
          <SiteHeader settings={settings} />
          <main className="flex-1 bg-white">{children}</main>
          <SiteFooter settings={settings} />
        </div>
      </body>
    </html>
  );
}
