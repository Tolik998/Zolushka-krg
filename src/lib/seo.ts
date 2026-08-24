import { services } from "@/data/services";
import type { Locale } from "@/types/booking";
import { siteUrl } from "./i18n";
import type { Metadata } from "next";

export const localizedPageMetadata = (locale: Locale, path: string, title: { ru: string; kz: string }, description: { ru: string; kz: string }): Metadata => ({
  title: title[locale],
  description: description[locale],
  alternates: {
    canonical: `${siteUrl}/${locale}${path}`,
    languages: { ru: `${siteUrl}/ru${path}`, kk: `${siteUrl}/kz${path}`, "x-default": `${siteUrl}/ru${path}` },
  },
  openGraph: {
    title: `${title[locale]} | Zolushka.krg`,
    description: description[locale],
    url: `${siteUrl}/${locale}${path}`,
    locale: locale === "ru" ? "ru_KZ" : "kk_KZ",
    type: "website",
    images: [{ url: "/images/hero-nude-manicure.png", width: 1536, height: 1024 }],
  },
});

export const makeLocalBusinessJsonLd = (locale: Locale) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["BeautySalon", "LocalBusiness"],
      "@id": `${siteUrl}/${locale}#salon`,
      name: "Zolushka.krg",
      description:
        locale === "ru"
          ? "Салон красоты и ногтевая студия в Караганде. Маникюр, педикюр, брови и ресницы, в том числе формат 4 и 6 рук."
          : "Қарағандыдағы сұлулық салоны және тырнақ студиясы. Маникюр, педикюр, қас пен кірпік, соның ішінде 4 және 6 қол форматы.",
      url: `${siteUrl}/${locale}`,
      telephone: "+77075856273",
      email: "wj_foxy@mail.ru",
      image: `${siteUrl}/images/hero-nude-manicure.png`,
      priceRange: "₸₸",
      address: {
        "@type": "PostalAddress",
        streetAddress: "улица Лободы, 4",
        addressLocality: "Караганда",
        addressCountry: "KZ",
      },
      openingHoursSpecification: [{
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "08:00",
        closes: "21:00",
      }],
      aggregateRating: { "@type": "AggregateRating", ratingValue: 4.9, ratingCount: 274, bestRating: 5 },
      sameAs: ["https://instagram.com/zolushka.krg", "https://2gis.kz/karaganda/firm/70000001058920315"],
      makesOffer: {
        "@type": "OfferCatalog",
        name: locale === "ru" ? "Каталог услуг" : "Қызметтер каталогы",
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          priceCurrency: "KZT",
          price: service.price,
          eligibleRegion: "Karaganda",
          itemOffered: { "@type": "Service", name: service.name[locale] },
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [{
        "@type": "ListItem",
        position: 1,
        name: locale === "ru" ? "Главная" : "Басты бет",
        item: `${siteUrl}/${locale}`,
      }],
    },
  ],
});
