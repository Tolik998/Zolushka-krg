import { notFound } from "next/navigation";
import { MastersView } from "@/components/masters-view";
import { isLocale } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) return {}; return localizedPageMetadata(locale, "/masters", { ru: "Мастера — роли команды", kz: "Шеберлер — команда рөлдері" }, { ru: "Роли специалистов салона без вымышленных имён и биографий.", kz: "Ойдан шығарылған есімдер мен өмірбаяндарсыз салон мамандарының рөлдері." }); }
export default async function MastersPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <MastersView locale={locale} />; }
