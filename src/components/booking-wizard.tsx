"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Search,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  categoryNames,
  formatPrice,
  serviceById,
  services,
} from "@/data/services";
import { bookingProvider } from "@/providers/demo-booking-provider";
import type {
  BookingDraft,
  BookingMode,
  BookingResult,
  Locale,
  Service,
  ServiceCategory,
  Specialist,
  TimeSlot,
} from "@/types/booking";

const emptyDraft: BookingDraft = {
  mode: "single",
  serviceIds: [],
  specialistId: null,
  date: "",
  time: "",
  name: "",
  phone: "",
  comment: "",
};
const modes: BookingMode[] = ["single", "four-hands", "six-hands"];
const categoryOrder = Object.keys(categoryNames) as ServiceCategory[];

const localDateString = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

const buildDateOptions = () =>
  Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index);
    return { value: localDateString(date), date };
  });

const slotHour = (slot: TimeSlot) => Number(slot.label.slice(0, 2));

export function BookingWizard({
  locale,
  initialMode = "single",
  initialServices = [],
}: {
  locale: Locale;
  initialMode?: BookingMode;
  initialServices?: string[];
}) {
  const isRu = locale === "ru";
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<BookingDraft>({
    ...emptyDraft,
    mode: initialMode,
    serviceIds: initialServices.filter((id) => serviceById.has(id)),
  });
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [dateOptions] =
    useState<ReturnType<typeof buildDateOptions>>(buildDateOptions);
  const [serviceQuery, setServiceQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [specialistsBusy, setSpecialistsBusy] = useState(false);
  const [slotsBusy, setSlotsBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BookingResult | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const selected = useMemo(
    () =>
      draft.serviceIds
        .map((id) => serviceById.get(id))
        .filter((service): service is Service => Boolean(service)),
    [draft.serviceIds],
  );
  const total = selected.reduce((sum, service) => sum + service.price, 0);
  const duration =
    draft.mode === "single"
      ? selected.reduce((sum, service) => sum + service.durationMinutes, 0)
      : Math.max(0, ...selected.map((service) => service.durationMinutes));
  const hasPriceFrom = selected.some((service) => service.priceFrom);
  const chosenSpecialist = specialists.find(
    (specialist) => specialist.id === draft.specialistId,
  );

  const filteredServices = useMemo(() => {
    const query = serviceQuery
      .trim()
      .toLocaleLowerCase(locale === "kz" ? "kk-KZ" : "ru-RU");
    if (!query) return [];
    return services.filter((service) =>
      `${service.name[locale]} ${categoryNames[service.category][locale]}`
        .toLocaleLowerCase(locale === "kz" ? "kk-KZ" : "ru-RU")
        .includes(query),
    );
  }, [locale, serviceQuery]);

  const serviceGroups = useMemo(
    () => [
      {
        key: "popular",
        name: isRu ? "Популярные" : "Танымал",
        items: services.filter((service) => service.isPopular),
      },
      ...categoryOrder.map((category) => ({
        key: category,
        name: categoryNames[category][locale],
        items: services.filter((service) => service.category === category),
      })),
    ],
    [isRu, locale],
  );

  const timeGroups = useMemo(
    () => [
      {
        key: "morning",
        label: isRu ? "Утро" : "Таң",
        slots: slots.filter((slot) => slotHour(slot) < 12),
      },
      {
        key: "day",
        label: isRu ? "День" : "Күндіз",
        slots: slots.filter(
          (slot) => slotHour(slot) >= 12 && slotHour(slot) < 17,
        ),
      },
      {
        key: "evening",
        label: isRu ? "Вечер" : "Кеш",
        slots: slots.filter((slot) => slotHour(slot) >= 17),
      },
    ],
    [isRu, slots],
  );

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  useEffect(() => {
    let active = true;
    if (!draft.serviceIds.length) return;
    Promise.resolve()
      .then(() => {
        if (active) setSpecialistsBusy(true);
        return bookingProvider.getSpecialists({
          serviceIds: draft.serviceIds,
          mode: draft.mode,
        });
      })
      .then((value) => {
        if (!active) return;
        setSpecialists(value);
        setSpecialistsBusy(false);
      });
    return () => {
      active = false;
    };
  }, [draft.mode, draft.serviceIds]);

  useEffect(() => {
    let active = true;
    if (step !== 2 || !draft.date) return;
    Promise.resolve()
      .then(() => {
        if (active) setSlotsBusy(true);
        return bookingProvider.getAvailableSlots({
          serviceIds: draft.serviceIds,
          mode: draft.mode,
          specialistId: draft.specialistId,
          date: draft.date,
        });
      })
      .then((value) => {
        if (!active) return;
        setSlots(value);
        setSlotsBusy(false);
      });
    return () => {
      active = false;
    };
  }, [draft.date, draft.mode, draft.serviceIds, draft.specialistId, step]);

  const resetSchedule = (current: BookingDraft) => ({
    ...current,
    date: "",
    time: "",
  });

  const selectMode = (mode: BookingMode) => {
    setError("");
    setSpecialists([]);
    setSlots([]);
    setDraft((current) => ({
      ...resetSchedule(current),
      mode,
      serviceIds: [],
      specialistId: null,
    }));
  };

  const toggleService = (service: Service) => {
    if (!service.compatibleModes.includes(draft.mode)) return;
    setError("");
    setSlots([]);
    setDraft((current) => {
      const serviceIds = current.serviceIds.includes(service.id)
        ? current.serviceIds.filter((id) => id !== service.id)
        : [...current.serviceIds, service.id];
      return { ...resetSchedule(current), serviceIds, specialistId: null };
    });
  };

  const selectSpecialist = (specialistId: string | null) => {
    setSlots([]);
    setDraft((current) => ({ ...resetSchedule(current), specialistId }));
  };

  const goNext = async () => {
    setError("");
    if (step === 1) {
      if (!draft.serviceIds.length) {
        setError(
          isRu
            ? "Выберите хотя бы одну услугу."
            : "Кемінде бір қызмет таңдаңыз.",
        );
        return;
      }
      setBusy(true);
      const compatibility = await bookingProvider.getCompatibleCombinations(
        draft.serviceIds,
        draft.mode,
      );
      setBusy(false);
      if (!compatibility.compatible) {
        setError(
          `${compatibility.reason[locale]}${compatibility.alternative ? ` ${compatibility.alternative[locale]}` : ""}`,
        );
        return;
      }
      setDraft((current) => ({
        ...current,
        date: current.date || localDateString(),
        time: "",
      }));
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!draft.date || draft.date < localDateString()) {
        setError(
          isRu
            ? "Выберите сегодня или будущую дату."
            : "Бүгінгі немесе болашақ күнді таңдаңыз.",
        );
        return;
      }
      if (!draft.time) {
        setError(isRu ? "Выберите свободное время." : "Бос уақытты таңдаңыз.");
        return;
      }
      setStep(3);
    }
  };

  const finish = async () => {
    setError("");
    if (
      draft.name.trim().length < 2 ||
      !/^\+?[0-9\s()-]{10,18}$/.test(draft.phone)
    ) {
      setError(
        isRu
          ? "Укажите имя и корректный номер телефона."
          : "Аты-жөніңізді және дұрыс телефон нөмірін көрсетіңіз.",
      );
      return;
    }
    setBusy(true);
    const response = await bookingProvider.createBooking(draft);
    setResult(response);
    setDraft((current) => ({ ...current, name: "", phone: "", comment: "" }));
    setBusy(false);
  };

  const goBack = () => {
    setError("");
    setStep((current) => Math.max(1, current - 1));
  };
  const startAgain = () => {
    setDraft({ ...emptyDraft, mode: initialMode });
    setResult(null);
    setSlots([]);
    setSpecialists([]);
    setServiceQuery("");
    setStep(1);
  };

  const formatMode = (mode: BookingMode) =>
    mode === "single"
      ? isRu
        ? "Обычная запись"
        : "Кәдімгі жазылу"
      : mode === "four-hands"
        ? isRu
          ? "В 4 руки"
          : "4 қолмен"
        : isRu
          ? "В 6 рук"
          : "6 қолмен";
  const formattedDate = draft.date
    ? new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "kk-KZ", {
        day: "numeric",
        month: "long",
        weekday: "short",
      }).format(new Date(`${draft.date}T12:00:00`))
    : "—";
  const stepLabels = isRu
    ? ["Услуги и мастер", "Дата и время", "Ваши данные"]
    : ["Қызмет пен шебер", "Күн мен уақыт", "Сіздің деректеріңіз"];

  return (
    <section
      className="booking-page zapis-flow"
      aria-labelledby="booking-title"
    >
      <header className="page-intro compact">
        <p className="eyebrow">
          {isRu ? "Быстрая онлайн-запись" : "Жылдам онлайн-жазылу"}
        </p>
        <h1 id="booking-title">
          {isRu ? "Запишитесь за три шага" : "Үш қадамда жазылыңыз"}
        </h1>
        <p className="lede">
          {isRu
            ? "Выберите услуги, удобное время и оставьте контакты. Сейчас данные никуда не отправляются."
            : "Қызметті, ыңғайлы уақытты таңдап, байланыс деректерін қалдырыңыз. Қазір деректер ешқайда жіберілмейді."}
        </p>
      </header>

      <ol
        className="zapis-progress"
        aria-label={isRu ? "Этапы записи" : "Жазылу кезеңдері"}
      >
        {stepLabels.map((label, index) => {
          const number = index + 1;
          const done = result ? true : step > number;
          const active = !result && step === number;
          return (
            <li
              key={label}
              className={active ? "active" : done ? "done" : ""}
              aria-current={active ? "step" : undefined}
            >
              <span>
                {done ? <Check aria-hidden="true" size={16} /> : number}
              </span>
              <strong>{label}</strong>
            </li>
          );
        })}
      </ol>

      <div className="zapis-booking-shell">
        <div className="zapis-main-card" aria-live="polite">
          {result ? (
            <div className="booking-result">
              <span className="result-check">
                <Check aria-hidden="true" />
              </span>
              <p className="eyebrow">
                {isRu ? "Данные не отправлены" : "Деректер жіберілмеді"}
              </p>
              <h2>{isRu ? "Выбор собран" : "Таңдау дайын"}</h2>
              <p>{result.message[locale]}</p>
              <p className="micro-note">
                {isRu
                  ? "Имя, телефон и комментарий очищены. Номер записи не создавался."
                  : "Аты-жөні, телефон және пікір өшірілді. Жазба нөмірі жасалмады."}
              </p>
              <button
                className="button button-dark"
                type="button"
                onClick={startAgain}
              >
                {isRu ? "Начать заново" : "Қайта бастау"}
              </button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="zapis-step">
                  <div className="zapis-step-heading">
                    <span>01</span>
                    <div>
                      <h2>
                        {isRu ? "Выберите услуги" : "Қызметтерді таңдаңыз"}
                      </h2>
                      <p>
                        {isRu
                          ? "Сначала формат визита, затем услуги и мастер."
                          : "Алдымен келу форматы, содан кейін қызмет пен шебер."}
                      </p>
                    </div>
                  </div>
                  <div
                    className="booking-mode-switch"
                    aria-label={isRu ? "Формат визита" : "Келу форматы"}
                  >
                    {modes.map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        className={draft.mode === mode ? "active" : ""}
                        onClick={() => selectMode(mode)}
                        aria-pressed={draft.mode === mode}
                      >
                        <strong>{formatMode(mode)}</strong>
                        <small>
                          {mode === "single"
                            ? isRu
                              ? "последовательно"
                              : "кезекпен"
                            : mode === "four-hands"
                              ? isRu
                                ? "2 услуги"
                                : "2 қызмет"
                              : isRu
                                ? "до 3 услуг"
                                : "3 қызметке дейін"}
                        </small>
                      </button>
                    ))}
                  </div>
                  <label className="booking-search">
                    <Search aria-hidden="true" />
                    <span className="sr-only">
                      {isRu ? "Поиск услуги" : "Қызметті іздеу"}
                    </span>
                    <input
                      type="search"
                      value={serviceQuery}
                      onChange={(event) => setServiceQuery(event.target.value)}
                      placeholder={
                        isRu ? "Поиск по услугам" : "Қызметтерді іздеу"
                      }
                    />
                  </label>
                  <div
                    className="booking-services"
                    aria-label={isRu ? "Каталог услуг" : "Қызметтер каталогы"}
                  >
                    {serviceQuery ? (
                      <div className="booking-service-results">
                        {filteredServices.length ? (
                          filteredServices.map((service) => (
                            <ServiceChoice
                              key={service.id}
                              service={service}
                              locale={locale}
                              mode={draft.mode}
                              selected={draft.serviceIds.includes(service.id)}
                              onToggle={toggleService}
                            />
                          ))
                        ) : (
                          <p className="empty-state">
                            {isRu ? "Ничего не найдено." : "Ештеңе табылмады."}
                          </p>
                        )}
                      </div>
                    ) : (
                      serviceGroups.map((group) => (
                        <details
                          className="booking-service-group"
                          key={group.key}
                        >
                          <summary>
                            <span>{group.name}</span>
                            <small>{group.items.length}</small>
                            <ChevronDown aria-hidden="true" />
                          </summary>
                          <div>
                            {group.items.map((service) => (
                              <ServiceChoice
                                key={`${group.key}-${service.id}`}
                                service={service}
                                locale={locale}
                                mode={draft.mode}
                                selected={draft.serviceIds.includes(service.id)}
                                onToggle={toggleService}
                              />
                            ))}
                          </div>
                        </details>
                      ))
                    )}
                  </div>
                  <div className="master-picker">
                    <div className="master-picker-title">
                      <UserRound aria-hidden="true" />
                      <div>
                        <h3>
                          {draft.mode === "single"
                            ? isRu
                              ? "Выберите мастера"
                              : "Шеберді таңдаңыз"
                            : isRu
                              ? "Команда мастеров"
                              : "Шеберлер командасы"}
                        </h3>
                        <p>
                          {isRu
                            ? "Можно оставить выбор администратору."
                            : "Таңдауды әкімшіге қалдыруға болады."}
                        </p>
                      </div>
                    </div>
                    {!draft.serviceIds.length ? (
                      <p className="master-empty">
                        {isRu
                          ? "Сначала добавьте услугу."
                          : "Алдымен қызмет қосыңыз."}
                      </p>
                    ) : specialistsBusy ? (
                      <p className="master-empty">
                        {isRu
                          ? "Подбираем подходящих мастеров…"
                          : "Сәйкес шеберлер таңдалуда…"}
                      </p>
                    ) : draft.mode === "single" ? (
                      <div className="master-options">
                        <button
                          type="button"
                          className={
                            draft.specialistId === null ? "active" : ""
                          }
                          onClick={() => selectSpecialist(null)}
                          aria-pressed={draft.specialistId === null}
                        >
                          <span className="master-avatar">
                            <UserRound aria-hidden="true" />
                          </span>
                          <span>
                            <strong>
                              {isRu
                                ? "Любой свободный мастер"
                                : "Кез келген бос шебер"}
                            </strong>
                            <small>
                              {isRu
                                ? "Подберёт администратор"
                                : "Әкімші таңдайды"}
                            </small>
                          </span>
                          <Check aria-hidden="true" />
                        </button>
                        {specialists.map((specialist) => (
                          <button
                            type="button"
                            key={specialist.id}
                            className={
                              draft.specialistId === specialist.id
                                ? "active"
                                : ""
                            }
                            onClick={() => selectSpecialist(specialist.id)}
                            aria-pressed={draft.specialistId === specialist.id}
                          >
                            <span className="master-avatar">
                              <UserRound aria-hidden="true" />
                            </span>
                            <span>
                              <strong>{specialist.role[locale]}</strong>
                              <small>
                                {isRu ? "Роль специалиста" : "Маман рөлі"}
                              </small>
                            </span>
                            <Check aria-hidden="true" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="team-selection">
                        <strong>
                          {isRu
                            ? "Команда подбирается по выбранным услугам"
                            : "Команда таңдалған қызметтер бойынша құрылады"}
                        </strong>
                        <div>
                          {specialists.map((specialist) => (
                            <span key={specialist.id}>
                              {specialist.role[locale]}
                            </span>
                          ))}
                        </div>
                        <small>
                          {isRu
                            ? "Финальный состав подтвердит администратор."
                            : "Соңғы құрамды әкімші растайды."}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="zapis-step">
                  <div className="zapis-step-heading">
                    <span>02</span>
                    <div>
                      <h2>
                        {isRu
                          ? "Выберите дату и время"
                          : "Күн мен уақытты таңдаңыз"}
                      </h2>
                      <p>
                        {isRu
                          ? "Ежедневно с 08:00 до 21:00."
                          : "Күн сайын 08:00–21:00."}
                      </p>
                    </div>
                  </div>
                  <div
                    className="date-strip"
                    aria-label={isRu ? "Доступные даты" : "Қолжетімді күндер"}
                  >
                    {dateOptions.map(({ value, date }) => (
                      <button
                        key={value}
                        type="button"
                        className={draft.date === value ? "active" : ""}
                        onClick={() => {
                          setError("");
                          setDraft((current) => ({
                            ...current,
                            date: value,
                            time: "",
                          }));
                        }}
                        aria-pressed={draft.date === value}
                      >
                        <small>
                          {new Intl.DateTimeFormat(
                            locale === "ru" ? "ru-RU" : "kk-KZ",
                            { weekday: "short" },
                          ).format(date)}
                        </small>
                        <strong>{date.getDate()}</strong>
                        <span>
                          {new Intl.DateTimeFormat(
                            locale === "ru" ? "ru-RU" : "kk-KZ",
                            { month: "short" },
                          ).format(date)}
                        </span>
                      </button>
                    ))}
                  </div>
                  {slotsBusy ? (
                    <p className="slots-loading">
                      {isRu
                        ? "Показываем доступные интервалы…"
                        : "Қолжетімді уақыт көрсетілуде…"}
                    </p>
                  ) : (
                    <div className="time-groups">
                      {timeGroups.map((group) => (
                        <section
                          key={group.key}
                          aria-labelledby={`time-${group.key}`}
                        >
                          <h3 id={`time-${group.key}`}>
                            <Clock3 aria-hidden="true" /> {group.label}
                          </h3>
                          <div className="slot-grid">
                            {group.slots.map((slot) => (
                              <button
                                key={slot.id}
                                type="button"
                                disabled={!slot.available}
                                className={
                                  draft.time === slot.label
                                    ? "slot active"
                                    : "slot"
                                }
                                onClick={() => {
                                  setError("");
                                  setDraft((current) => ({
                                    ...current,
                                    time: slot.label,
                                  }));
                                }}
                                aria-pressed={draft.time === slot.label}
                              >
                                {slot.label}
                              </button>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  )}
                  <p className="micro-note">
                    {isRu
                      ? "Интервалы ориентировочные. Администратор подтвердит доступность мастеров и время."
                      : "Уақыт аралығы шамамен көрсетілген. Әкімші шеберлердің қолжетімділігі мен уақытын растайды."}
                  </p>
                </div>
              )}

              {step === 3 && (
                <div className="zapis-step">
                  <div className="zapis-step-heading">
                    <span>03</span>
                    <div>
                      <h2>
                        {isRu ? "Подтвердите данные" : "Деректерді тексеріңіз"}
                      </h2>
                      <p>
                        {isRu
                          ? "Проверьте визит и оставьте контакты."
                          : "Келуді тексеріп, байланыс деректерін қалдырыңыз."}
                      </p>
                    </div>
                  </div>
                  <div className="booking-confirmation">
                    <div className="booking-confirmation-head">
                      <div>
                        <strong>Zolushka.krg</strong>
                        <span>
                          {formattedDate}
                          {draft.time ? ` · ${draft.time}` : ""}
                        </span>
                      </div>
                      <CalendarDays aria-hidden="true" />
                    </div>
                    {selected.map((service) => (
                      <div className="confirmation-service" key={service.id}>
                        <span>
                          {service.name[locale]}
                          <small>
                            {chosenSpecialist?.role[locale] ??
                              (draft.mode === "single"
                                ? isRu
                                  ? "Любой свободный мастер"
                                  : "Кез келген бос шебер"
                                : isRu
                                  ? "Команда мастеров"
                                  : "Шеберлер командасы")}
                          </small>
                        </span>
                        <strong>{formatPrice(service, locale)}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="contact-fields">
                    <label className="form-field">
                      <span>{isRu ? "Имя" : "Аты-жөні"}</span>
                      <input
                        autoComplete="name"
                        value={draft.name}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="form-field">
                      <span>{isRu ? "Телефон" : "Телефон"}</span>
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+7 707 000 00 00"
                        value={draft.phone}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className="form-field contact-comment">
                      <span>
                        {isRu
                          ? "Комментарий — необязательно"
                          : "Пікір — міндетті емес"}
                      </span>
                      <textarea
                        rows={4}
                        maxLength={500}
                        value={draft.comment}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            comment: event.target.value,
                          }))
                        }
                        placeholder={
                          isRu
                            ? "Например: нужна консультация по оттенку"
                            : "Мысалы: түс бойынша кеңес қажет"
                        }
                      />
                    </label>
                  </div>
                  <div className="privacy-inline">
                    <ShieldCheck aria-hidden="true" />
                    <p>
                      {isRu
                        ? "Имя, телефон и комментарий остаются только в памяти страницы и очищаются после результата."
                        : "Аты-жөні, телефон және пікір тек беттің жадында қалады және нәтижеден кейін өшіріледі."}
                    </p>
                  </div>
                  <p className="booking-local-note">
                    {isRu
                      ? "Нажатие кнопки не отправит данные и не создаст реальную запись."
                      : "Батырманы басу деректерді жібермейді және нақты жазба құрмайды."}
                  </p>
                </div>
              )}

              {error && (
                <p
                  className="form-error"
                  role="alert"
                  tabIndex={-1}
                  ref={errorRef}
                >
                  {error}
                </p>
              )}
              <div className="zapis-actions">
                {step > 1 ? (
                  <button
                    className="button button-ghost"
                    type="button"
                    onClick={goBack}
                  >
                    <ArrowLeft aria-hidden="true" /> {isRu ? "Назад" : "Артқа"}
                  </button>
                ) : (
                  <span />
                )}
                {step < 3 ? (
                  <button
                    className="button button-dark"
                    type="button"
                    disabled={busy}
                    onClick={goNext}
                  >
                    {busy
                      ? isRu
                        ? "Проверяем…"
                        : "Тексерілуде…"
                      : isRu
                        ? "Далее"
                        : "Әрі қарай"}{" "}
                    <ArrowRight aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    className="button button-cobalt"
                    type="button"
                    disabled={busy}
                    onClick={finish}
                  >
                    {busy
                      ? isRu
                        ? "Обрабатываем локально…"
                        : "Жергілікті өңделуде…"
                      : isRu
                        ? "Показать результат"
                        : "Нәтижені көрсету"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {!result && (
          <aside
            className="booking-summary"
            aria-label={isRu ? "Ваш визит" : "Сіздің келуіңіз"}
          >
            <p className="eyebrow">{isRu ? "Ваш визит" : "Сіздің келуіңіз"}</p>
            <h2>{formatMode(draft.mode)}</h2>
            {selected.length ? (
              <div className="summary-services">
                {selected.map((service) => (
                  <div key={service.id}>
                    <span>{service.name[locale]}</span>
                    <strong>{formatPrice(service, locale)}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className="summary-empty">
                {isRu
                  ? "Добавьте услуги — здесь появится сводка."
                  : "Қызмет қосыңыз — қорытынды осында шығады."}
              </p>
            )}
            <dl>
              <div>
                <dt>
                  <UserRound aria-hidden="true" /> {isRu ? "Мастер" : "Шебер"}
                </dt>
                <dd>
                  {chosenSpecialist?.role[locale] ??
                    (isRu ? "Любой подходящий" : "Кез келген сәйкес")}
                </dd>
              </div>
              <div>
                <dt>
                  <CalendarDays aria-hidden="true" /> {isRu ? "Дата" : "Күні"}
                </dt>
                <dd>{formattedDate}</dd>
              </div>
              <div>
                <dt>
                  <Clock3 aria-hidden="true" /> {isRu ? "Время" : "Уақыты"}
                </dt>
                <dd>{draft.time || "—"}</dd>
              </div>
            </dl>
            <div className="summary-total">
              <span>
                <WalletCards aria-hidden="true" /> {isRu ? "Итого" : "Барлығы"}
              </span>
              <strong>
                {hasPriceFrom ? (isRu ? "от " : "бастап ") : ""}
                {total.toLocaleString("ru-RU")} ₸
              </strong>
              <small>
                ≈ {duration} {isRu ? "мин" : "мин"}
              </small>
            </div>
            <p className="summary-note">
              {isRu
                ? "Состав услуг и время подтверждает администратор."
                : "Қызмет құрамы мен уақытты әкімші растайды."}
            </p>
          </aside>
        )}
      </div>
    </section>
  );
}

function ServiceChoice({
  service,
  locale,
  mode,
  selected,
  onToggle,
}: {
  service: Service;
  locale: Locale;
  mode: BookingMode;
  selected: boolean;
  onToggle: (service: Service) => void;
}) {
  const compatible = service.compatibleModes.includes(mode);
  return (
    <button
      type="button"
      className={`booking-service-choice${selected ? " selected" : ""}`}
      disabled={!compatible}
      onClick={() => onToggle(service)}
      aria-pressed={selected}
    >
      <span className="service-choice-check">
        {selected ? <Check aria-hidden="true" /> : null}
      </span>
      <span className="service-choice-copy">
        <strong>{service.name[locale]}</strong>
        <small>≈ {service.durationMinutes} мин</small>
      </span>
      <span className="service-choice-price">
        {formatPrice(service, locale)}
      </span>
    </button>
  );
}
