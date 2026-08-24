import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarCheck, ShieldCheck, Star } from "lucide-react";
import { portfolioItems } from "@/data/portfolio";
import { formatPrice, services } from "@/data/services";
import { contactLinks } from "@/lib/i18n";
import type { Locale } from "@/types/booking";

export function Home({ locale }: { locale: Locale }) {
  const isRu = locale === "ru";
  const popular = services.filter((service) => service.isPopular).slice(0, 4);
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy reveal">
          <p className="hero-kicker">{isRu ? "Салон красоты · Караганда" : "Сұлулық салоны · Қарағанды"}</p>
          <h1 id="hero-title">{isRu ? <>Красота, для которой <em>находится время</em></> : <>Уақыт табылатын <em>сұлулық</em></>}</h1>
          <p>{isRu ? "Маникюр, педикюр, брови и ресницы — отдельно или одновременно в 4 и 6 рук." : "Маникюр, педикюр, қас пен кірпік — жеке немесе 4 және 6 қолмен бір уақытта."}</p>
          <div className="button-row"><Link className="button button-dark" href={`/${locale}/booking`}>{isRu ? "Записаться" : "Жазылу"}</Link><Link className="button button-ghost" href={`/${locale}/services`}>{isRu ? "Выбрать услуги" : "Қызметтерді таңдау"}</Link></div>
        </div>
        <div className="hero-media motion-image">
          <Image src="/images/hero-nude-manicure.png" alt={isRu ? "Иллюстративная фотография нюдового маникюра" : "Нюд маникюрінің иллюстрациялық фотосы"} fill loading="eager" sizes="(max-width: 900px) 100vw, 58vw" />
          <div className="hero-accent"><span>{isRu ? "Маникюр и педикюр" : "Маникюр және педикюр"}</span><strong>{isRu ? "одновременно" : "бір уақытта"}</strong></div>
          <small>{isRu ? "Иллюстративное изображение" : "Иллюстрациялық сурет"}</small>
        </div>
        <div className="hero-facts">
          <a href={contactLinks.twoGis} target="_blank" rel="noreferrer"><Star aria-hidden="true" fill="currentColor" /><strong>4.9</strong><span>{isRu ? "274 оценки в 2ГИС" : "2GIS-тегі 274 баға"}</span></a>
          <div><CalendarCheck aria-hidden="true" /><strong>{isRu ? "Ежедневно" : "Күн сайын"}</strong><span>08:00–21:00</span></div>
          <div><ShieldCheck aria-hidden="true" /><strong>{isRu ? "По записи" : "Жазылу бойынша"}</strong><span>{isRu ? "формат 4 и 6 рук" : "4 және 6 қол форматы"}</span></div>
        </div>
      </section>

      <section className="popular-section section-space reveal" aria-labelledby="popular-title">
        <div className="section-heading"><p className="eyebrow">{isRu ? "Популярный выбор" : "Танымал таңдау"}</p><h2 id="popular-title">{isRu ? "Начните с любимого ритуала" : "Сүйікті рәсімнен бастаңыз"}</h2><Link href={`/${locale}/services`}>{isRu ? "Весь прайс" : "Толық баға"} <ArrowUpRight aria-hidden="true" /></Link></div>
        <div className="popular-grid">{popular.map((service, index) => <article key={service.id} className="popular-card"><div className="popular-image"><Image src={service.image} alt="" fill sizes="(max-width: 720px) 100vw, 25vw" /></div><span>0{index + 1}</span><h3>{service.name[locale]}</h3><div><small>≈ {service.durationMinutes} {isRu ? "мин" : "мин"}</small><strong>{formatPrice(service, locale)}</strong></div><Link href={`/${locale}/booking?services=${service.id}`} aria-label={`${isRu ? "Выбрать" : "Таңдау"} ${service.name[locale]}`}><ArrowUpRight aria-hidden="true" /></Link></article>)}</div>
      </section>

      <section className="price-preview section-space reveal" aria-labelledby="price-title"><div className="section-heading"><p className="eyebrow">{isRu ? "Актуальный прайс" : "Өзекті баға"}</p><h2 id="price-title">{isRu ? "Прозрачно до визита" : "Келуге дейін ашық"}</h2><Link href={`/${locale}/services`}>{isRu ? "Открыть каталог" : "Каталогты ашу"} <ArrowUpRight aria-hidden="true" /></Link></div><div className="price-lines">{services.filter((service) => service.isPopular).slice(0, 6).map((service) => <div key={service.id}><span>{service.name[locale]}<small>{categoryNamesFallback(service.category, locale)}</small></span><strong>{formatPrice(service, locale)}</strong></div>)}</div><p className="micro-note">{isRu ? "Прайс обновлён 31.01.2026 · needsReview: true. Продолжительность указана ориентировочно." : "Баға 31.01.2026 жаңартылды · needsReview: true. Ұзақтық шамамен көрсетілген."}</p></section>

      <section className="portfolio-preview section-space reveal" aria-labelledby="portfolio-title"><div className="section-heading"><p className="eyebrow">{isRu ? "Визуальное направление" : "Визуалды бағыт"}</p><h2 id="portfolio-title">{isRu ? "Портфолио в едином стиле" : "Бір стильдегі портфолио"}</h2><Link href={`/${locale}/portfolio`}>{isRu ? "Все категории" : "Барлық санат"} <ArrowUpRight aria-hidden="true" /></Link></div><div className="portfolio-mosaic">{portfolioItems.slice(0, 4).map((item, index) => <figure key={`${item.id}-${index}`} className="motion-image"><Image src={item.image} alt={item.alt[locale]} fill sizes="(max-width: 720px) 100vw, 35vw" /><figcaption><span>{item.category[locale]}</span><small>{isRu ? "Иллюстративное изображение" : "Иллюстрациялық сурет"}</small></figcaption></figure>)}</div></section>

      <section className="faq section-space reveal" aria-labelledby="faq-title"><div className="section-heading"><p className="eyebrow">{isRu ? "Частые вопросы" : "Жиі қойылатын сұрақтар"}</p><h2 id="faq-title">{isRu ? "Перед визитом" : "Келу алдында"}</h2></div><div className="horizontal-accordion">{[
        [isRu ? "Любые услуги можно совместить?" : "Кез келген қызметті біріктіруге бола ма?", isRu ? "Нет. Совместимость зависит от процедур и доступности мастеров; администратор подтверждает итоговый состав." : "Жоқ. Үйлесімділік процедуралар мен шеберлердің қолжетімділігіне байланысты; соңғы құрамды әкімші растайды."],
        [isRu ? "Онлайн-запись уже настоящая?" : "Онлайн-жазылу қазір нақты ма?", isRu ? "Пока работает локальный сценарий. Данные не отправляются и не сохраняются." : "Әзірге жергілікті сценарий жұмыс істейді. Деректер жіберілмейді және сақталмайды."],
        [isRu ? "Как узнать о бонусах?" : "Бонустар туралы қалай білуге болады?", isRu ? "Подробности бонусной программы уточняйте у администратора." : "Бонустық бағдарламаның мәліметтерін әкімшіден сұраңыз."],
      ].map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
    </>
  );
}

function categoryNamesFallback(category: string, locale: Locale) {
  const names: Record<string, { ru: string; kz: string }> = {
    manicure: { ru: "Маникюр", kz: "Маникюр" }, pedicure: { ru: "Педикюр", kz: "Педикюр" }, lamination: { ru: "Ламинирование", kz: "Ламинация" }, brows: { ru: "Брови", kz: "Қас" }, halal: { ru: "Халяльные процедуры", kz: "Халал процедуралар" }, lashes: { ru: "Ресницы", kz: "Кірпік" }, men: { ru: "Для мужчин", kz: "Ерлерге" },
  };
  return names[category]?.[locale] ?? category;
}
