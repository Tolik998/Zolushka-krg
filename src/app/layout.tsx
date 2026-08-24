import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { siteUrl } from "@/lib/i18n";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin", "cyrillic"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Zolushka.krg — салон красоты в Караганде", template: "%s | Zolushka.krg" },
  description: "Маникюр, педикюр, брови и ресницы в Караганде. Онлайн-запись в 4 и 6 рук.",
  applicationName: "Zolushka.krg",
  icons: { icon: "/icon.png" },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru" data-scroll-behavior="smooth" className={montserrat.variable}><body>{children}</body></html>;
}
