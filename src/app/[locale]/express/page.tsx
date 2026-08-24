import { notFound } from "next/navigation";
import { ExpressBuilder } from "@/components/express-builder";
import { isLocale } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) return {}; return localizedPageMetadata(locale, "/express", { ru: "Экспресс-запись в 4 и 6 рук", kz: "4 және 6 қолмен экспресс-жазылу" }, { ru: "Соберите совместимый комплекс параллельных beauty-услуг.", kz: "Қатар орындалатын үйлесімді beauty-қызметтер кешенін құрастырыңыз." }); }
export default async function ExpressPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <ExpressBuilder locale={locale} />; }
