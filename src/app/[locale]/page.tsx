import { Home } from "@/components/home";
import { makeLocalBusinessJsonLd } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const jsonLd = makeLocalBusinessJsonLd(locale);
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><Home locale={locale} /></>;
}
