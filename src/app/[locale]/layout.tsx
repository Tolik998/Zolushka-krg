import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MotionEffects } from "@/components/motion-effects";
import { isLocale, locales, siteUrl } from "@/lib/i18n";
import type { Locale } from "@/types/booking";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const isRu = rawLocale === "ru";
  return {
    title: isRu ? "Салон красоты и ногтевая студия в Караганде" : "Қарағандыдағы сұлулық салоны және тырнақ студиясы",
    description: isRu ? "Маникюр, педикюр, брови и ресницы — отдельно или одновременно в 4 и 6 рук. Улица Лободы, 4." : "Маникюр, педикюр, қас пен кірпік — жеке немесе 4 және 6 қолмен бір уақытта. Лобода көшесі, 4.",
    alternates: { canonical: `${siteUrl}/${rawLocale}`, languages: { ru: `${siteUrl}/ru`, kk: `${siteUrl}/kz`, "x-default": `${siteUrl}/ru` } },
    openGraph: { title: `Zolushka.krg — ${isRu ? "салон красоты в Караганде" : "Қарағандыдағы сұлулық салоны"}`, description: isRu ? "Красота, для которой находится время" : "Уақыт табылатын сұлулық", url: `${siteUrl}/${rawLocale}`, locale: isRu ? "ru_KZ" : "kk_KZ", type: "website", images: [{ url: "/images/hero-nude-manicure.png", width: 1536, height: 1024, alt: isRu ? "Иллюстративный маникюр" : "Иллюстрациялық маникюр" }] },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  return <div lang={locale === "kz" ? "kk" : "ru"}><Header locale={locale} /><MotionEffects><main id="main">{children}</main><Footer locale={locale} /></MotionEffects></div>;
}
