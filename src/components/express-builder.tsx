"use client";

import Link from "next/link";
import { Check, Clock3, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { services } from "@/data/services";
import { bookingProvider } from "@/providers/demo-booking-provider";
import type { BookingMode, Locale, Service, ServiceCombination } from "@/types/booking";

const modeLabels: Record<BookingMode, { ru: string; kz: string }> = {
  single: { ru: "Обычная запись", kz: "Кәдімгі жазылу" },
  "four-hands": { ru: "В 4 руки", kz: "4 қолмен" },
  "six-hands": { ru: "В 6 рук", kz: "6 қолмен" },
};

function BuilderSelect({ label, value, onChange, options, locale }: { label: string; value: string; onChange: (value: string) => void; options: Service[]; locale: Locale }) {
  return <label className="builder-field"><span>{label}</span><select value={value} onChange={(e) => onChange(e.target.value)}><option value="">{locale === "ru" ? "Не выбрано" : "Таңдалмаған"}</option>{options.map((service) => <option value={service.id} key={service.id}>{service.name[locale]} — {service.price.toLocaleString("ru-RU")} ₸</option>)}</select></label>;
}

export function ExpressBuilder({ locale }: { locale: Locale }) {
  const isRu = locale === "ru";
  const [mode, setMode] = useState<BookingMode>("four-hands");
  const [hand, setHand] = useState("");
  const [feet, setFeet] = useState("");
  const [face, setFace] = useState("");
  const [result, setResult] = useState<ServiceCombination | null>(null);
  const selectedIds = useMemo(() => [hand, feet, face].filter(Boolean), [face, feet, hand]);
  const checking = result === null;

  useEffect(() => {
    let active = true;
    bookingProvider.getCompatibleCombinations(selectedIds, mode).then((value) => {
      if (active) setResult(value);
    });
    return () => { active = false; };
  }, [mode, selectedIds]);

  const groups = {
    hand: services.filter((service) => ["manicure", "halal", "men"].includes(service.category)),
    feet: services.filter((service) => service.category === "pedicure"),
    face: services.filter((service) => ["brows", "lashes", "lamination"].includes(service.category)),
  };

  const selectValue = (setter: (value: string) => void, value: string) => { setResult(null); setter(value); };

  return (
    <section className="builder" aria-labelledby="builder-title">
      <header className="page-intro">
        <p className="eyebrow">{isRu ? "Конструктор параллельных услуг" : "Қатар қызметтер конструкторы"}</p>
        <h1 id="builder-title">{isRu ? "Соберите формат в 4 или 6 рук" : "4 немесе 6 қол форматын құрастырыңыз"}</h1>
        <p className="lede">{isRu ? "Несколько услуг выполняются параллельно — продолжительность зависит от выбранного комплекса." : "Бірнеше қызмет қатар орындалады — ұзақтығы таңдалған кешенге байланысты."}</p>
      </header>

      <ol className="builder-steps" aria-label={isRu ? "Этапы конструктора" : "Конструктор кезеңдері"}>
        {(isRu ? ["Количество", "Маникюр", "Педикюр", "Брови / ресницы", "Проверка"] : ["Саны", "Маникюр", "Педикюр", "Қас / кірпік", "Тексеру"]).map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}
      </ol>

      <div className="mode-grid">
        {(Object.keys(modeLabels) as BookingMode[]).map((value) => (
          <button className={mode === value ? "mode-card active" : "mode-card"} aria-pressed={mode === value} onClick={() => { setResult(null); setMode(value); }} key={value}>
            <span>{value === "single" ? "1" : value === "four-hands" ? "4" : "6"}</span>
            <strong>{modeLabels[value][locale]}</strong>
            <small>{value === "single" ? (isRu ? "услуги последовательно" : "қызметтер кезекпен") : value === "four-hands" ? (isRu ? "две услуги параллельно" : "екі қызмет қатар") : (isRu ? "до трёх услуг параллельно" : "үш қызметке дейін қатар")}</small>
          </button>
        ))}
      </div>

      <div className="builder-workspace">
        <div className="builder-fields">
          <BuilderSelect locale={locale} label={isRu ? "Маникюр" : "Маникюр"} value={hand} onChange={(value) => selectValue(setHand, value)} options={groups.hand} />
          <BuilderSelect locale={locale} label={isRu ? "Педикюр" : "Педикюр"} value={feet} onChange={(value) => selectValue(setFeet, value)} options={groups.feet} />
          <BuilderSelect locale={locale} label={isRu ? "Брови или ресницы" : "Қас немесе кірпік"} value={face} onChange={(value) => selectValue(setFace, value)} options={groups.face} />
        </div>
        <aside className={result?.compatible ? "builder-result compatible" : "builder-result"} aria-live="polite" aria-busy={checking}>
          <div className="result-status">{checking ? <Clock3 aria-hidden="true" /> : result?.compatible ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}<span>{checking ? (isRu ? "Проверяем сочетание" : "Үйлесімділік тексерілуде") : result?.compatible ? (isRu ? "Сочетание подходит" : "Комбинация үйлеседі") : (isRu ? "Нужна корректировка" : "Түзету қажет")}</span></div>
          <p>{result?.reason[locale]}</p>
          {result?.alternative && <p className="alternative"><Sparkles aria-hidden="true" /> {result.alternative[locale]}</p>}
          <dl>
            <div><dt>{isRu ? "Ориентировочно" : "Шамамен"}</dt><dd>{(result?.estimatedPrice ?? 0).toLocaleString("ru-RU")} ₸</dd></div>
            <div><dt>{isRu ? "Ориентировочное время" : "Шамамен уақыт"}</dt><dd>≈ {result?.estimatedDurationMinutes ?? 0} {isRu ? "мин" : "мин"}</dd></div>
          </dl>
          <p className="micro-note">{isRu ? "Продолжительность рассчитана предварительно. Администратор подтверждает состав мастеров и время." : "Ұзақтық алдын ала есептелген. Шеберлер құрамы мен уақытын әкімші растайды."}</p>
          {result?.compatible ? <Link className="button button-cobalt" href={`/${locale}/booking?mode=${mode}&services=${selectedIds.join(",")}`}>{isRu ? "Выбрать дату и время" : "Күн мен уақытты таңдау"}</Link> : <button className="button button-disabled" disabled>{isRu ? "Сначала соберите совместимый набор" : "Алдымен үйлесімді жинақ құрыңыз"}</button>}
        </aside>
      </div>
    </section>
  );
}
