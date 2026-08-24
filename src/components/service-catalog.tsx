"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { categoryNames, formatPrice, services } from "@/data/services";
import type { Locale, Service, ServiceCategory } from "@/types/booking";

export function ServiceCatalog({ locale }: { locale: Locale }) {
  const isRu = locale === "ru";
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ServiceCategory | "all">("all");
  const [popularOnly, setPopularOnly] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [active, setActive] = useState<Service | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!active) return;
    closeRef.current?.focus();
    const close = (event: KeyboardEvent) => event.key === "Escape" && setActive(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [active]);

  const filtered = useMemo(() => services.filter((service) => {
    const matchesQuery = service.name[locale].toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (category === "all" || service.category === category) && (!popularOnly || service.isPopular);
  }), [category, locale, popularOnly, query]);

  const selectedServices = services.filter((service) => selected.includes(service.id));
  const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const duration = selectedServices.reduce((sum, service) => sum + service.durationMinutes, 0);
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <section className="catalog-layout" aria-labelledby="catalog-title">
      <div className="catalog-toolbar">
        <div>
          <p className="eyebrow">{isRu ? "Прайс обновлён 31 января 2026" : "Баға 2026 жылғы 31 қаңтарда жаңартылды"}</p>
          <h1 id="catalog-title">{isRu ? "Услуги и цены" : "Қызметтер мен бағалар"}</h1>
          <p className="lede">{isRu ? "Цены подтверждены предоставленным прайсом и требуют проверки перед запуском." : "Бағалар берілген прайспен расталған және іске қосу алдында тексеруді қажет етеді."}</p>
        </div>
        <div className="price-review" role="note">needsReview: true</div>
      </div>

      <div className="catalog-controls" role="search">
        <label className="search-field"><Search aria-hidden="true" /><span className="sr-only">{isRu ? "Поиск услуг" : "Қызмет іздеу"}</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={isRu ? "Найти услугу" : "Қызметті табу"} /></label>
        <button className={popularOnly ? "filter-chip active" : "filter-chip"} onClick={() => setPopularOnly((value) => !value)} aria-pressed={popularOnly}>{isRu ? "Популярные" : "Танымал"}</button>
      </div>

      <div className="category-scroll" aria-label={isRu ? "Категории услуг" : "Қызмет санаттары"}>
        <button className={category === "all" ? "filter-chip active" : "filter-chip"} onClick={() => setCategory("all")}>{isRu ? "Все" : "Барлығы"}</button>
        {(Object.keys(categoryNames) as ServiceCategory[]).map((key) => <button key={key} className={category === key ? "filter-chip active" : "filter-chip"} onClick={() => setCategory(key)}>{categoryNames[key][locale]}</button>)}
      </div>

      <div className="service-grid">
        {filtered.map((service, index) => (
          <article className="service-card" key={service.id}>
            <button className="service-card-main" onClick={() => setActive(service)} aria-label={`${service.name[locale]}, ${formatPrice(service, locale)}`}>
              <div className="service-thumb"><Image src={service.image} alt="" fill loading={index < 2 ? "eager" : "lazy"} sizes="(max-width: 720px) 30vw, 140px" /></div>
              <div><span>{categoryNames[service.category][locale]}</span><h2>{service.name[locale]}</h2><p>{isRu ? "Ориентировочное время" : "Шамамен уақыт"}: {service.durationMinutes} {isRu ? "мин" : "мин"}</p></div>
              <strong>{formatPrice(service, locale)}</strong>
            </button>
            <button className={selected.includes(service.id) ? "select-service selected" : "select-service"} onClick={() => toggle(service.id)} aria-pressed={selected.includes(service.id)}>{selected.includes(service.id) ? (isRu ? "Добавлено" : "Қосылды") : (isRu ? "Добавить в запись" : "Жазылуға қосу")}</button>
          </article>
        ))}
      </div>
      {!filtered.length && <p className="empty-state">{isRu ? "Ничего не найдено. Измените запрос или фильтр." : "Ештеңе табылмады. Сұрауды немесе сүзгіні өзгертіңіз."}</p>}

      {selected.length > 0 && (
        <aside className="selection-bar" aria-live="polite">
          <div><small>{isRu ? "Выбрано" : "Таңдалды"}: {selected.length}</small><strong>{new Intl.NumberFormat("ru-RU").format(total)} ₸</strong><span>≈ {duration} {isRu ? "мин, ориентировочно" : "мин, шамамен"}</span></div>
          <Link className="button button-cobalt" href={`/${locale}/booking?services=${selected.join(",")}`}>{isRu ? "Продолжить" : "Жалғастыру"}</Link>
        </aside>
      )}

      {active && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && setActive(null)}>
          <section className="service-modal" role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
            <button ref={closeRef} className="icon-button modal-close" onClick={() => setActive(null)} aria-label={isRu ? "Закрыть" : "Жабу"}><X aria-hidden="true" /></button>
            <div className="modal-image"><Image src={active.image} alt={isRu ? "Иллюстративное изображение услуги" : "Қызметтің иллюстрациялық суреті"} fill sizes="(max-width: 720px) 100vw, 50vw" /></div>
            <div className="modal-copy"><p className="eyebrow">{categoryNames[active.category][locale]}</p><h2 id="service-modal-title">{active.name[locale]}</h2><p>{active.description[locale]}</p><dl><div><dt>{isRu ? "Цена" : "Баға"}</dt><dd>{formatPrice(active, locale)}</dd></div><div><dt>{isRu ? "Продолжительность" : "Ұзақтығы"}</dt><dd>≈ {active.durationMinutes} {isRu ? "мин" : "мин"}</dd></div></dl><p className="micro-note">{isRu ? "Иллюстративное изображение. Точную продолжительность уточняет администратор." : "Иллюстрациялық сурет. Нақты ұзақтықты әкімші нақтылайды."}</p><button className="button button-dark" onClick={() => { toggle(active.id); setActive(null); }}>{isRu ? "Добавить в запись" : "Жазылуға қосу"}</button></div>
          </section>
        </div>
      )}
    </section>
  );
}
