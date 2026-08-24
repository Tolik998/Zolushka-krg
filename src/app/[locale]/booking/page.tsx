import { notFound } from "next/navigation";
import { BookingWizard } from "@/components/booking-wizard";
import { isLocale } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/seo";
import type { BookingMode } from "@/types/booking";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) return {}; return localizedPageMetadata(locale, "/booking", { ru: "Онлайн-запись", kz: "Онлайн-жазылу" }, { ru: "Локальный сценарий записи без отправки и сохранения персональных данных.", kz: "Жеке деректерді жібермейтін және сақтамайтын жергілікті жазылу сценарийі." }); }
export default async function BookingPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ mode?: string; services?: string }> }) {
  const [{ locale }, query] = await Promise.all([params, searchParams]); if (!isLocale(locale)) notFound();
  const mode: BookingMode = query.mode === "four-hands" || query.mode === "six-hands" ? query.mode : "single";
  const initialServices = query.services?.split(",").filter(Boolean) ?? [];
  return <BookingWizard locale={locale} initialMode={mode} initialServices={initialServices} />;
}
