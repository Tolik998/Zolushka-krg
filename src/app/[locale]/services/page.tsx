import { notFound } from "next/navigation";
import { ServiceCatalog } from "@/components/service-catalog";
import { isLocale } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) return {}; return localizedPageMetadata(locale, "/services", { ru: "Услуги и цены", kz: "Қызметтер мен бағалар" }, { ru: "Актуальный прайс на маникюр, педикюр, брови и ресницы в Караганде.", kz: "Қарағандыдағы маникюр, педикюр, қас пен кірпіктің өзекті бағасы." }); }
export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <ServiceCatalog locale={locale} />; }
