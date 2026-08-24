import { notFound } from "next/navigation";
import { PortfolioView } from "@/components/portfolio-view";
import { isLocale } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) return {}; return localizedPageMetadata(locale, "/portfolio", { ru: "Портфолио — иллюстративные изображения", kz: "Портфолио — иллюстрациялық суреттер" }, { ru: "Иллюстративное визуальное направление маникюра, бровей и ресниц.", kz: "Маникюр, қас және кірпікке арналған иллюстрациялық визуалды бағыт." }); }
export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <PortfolioView locale={locale} />; }
