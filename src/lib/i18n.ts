import type { Locale } from "@/types/booking";

export const locales: Locale[] = ["ru", "kz"];
export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);

export const copy = {
  ru: {
    nav: { home: "Главная", services: "Услуги", express: "4/6 рук", booking: "Запись", masters: "Мастера", portfolio: "Портфолио", contacts: "Контакты" },
    book: "Записаться",
    chooseServices: "Выбрать услуги",
    demo: "Ознакомительная версия",
    illustrative: "Иллюстративное изображение",
    dataNote: "Локальные данные — не фактическое расписание салона",
  },
  kz: {
    nav: { home: "Басты бет", services: "Қызметтер", express: "4/6 қол", booking: "Жазылу", masters: "Шеберлер", portfolio: "Портфолио", contacts: "Байланыс" },
    book: "Жазылу",
    chooseServices: "Қызметтерді таңдау",
    demo: "Таныстыру нұсқасы",
    illustrative: "Иллюстрациялық сурет",
    dataNote: "Жергілікті деректер — салонның нақты кестесі емес",
  },
} as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zolushka-krg.sites-plus-portfolio.workers.dev";
export const phoneDigits = process.env.NEXT_PUBLIC_PHONE ?? "77075856273";
export const whatsappDigits = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "77075856273";

export const contactLinks = {
  tel: `tel:+${phoneDigits}`,
  whatsapp: `https://wa.me/${whatsappDigits}`,
  instagram: "https://instagram.com/zolushka.krg",
  twoGis: "https://2gis.kz/karaganda/firm/70000001058920315",
  route: "https://2gis.kz/karaganda/directions/points/%7C73.085585,49.803642;70000001058920315",
  email: "mailto:wj_foxy@mail.ru",
};
