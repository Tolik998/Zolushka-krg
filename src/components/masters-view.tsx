import Image from "next/image";
import Link from "next/link";
import { Clock3, Users } from "lucide-react";
import { specialists } from "@/data/specialists";
import type { Locale } from "@/types/booking";

export function MastersView({ locale }: { locale: Locale }) {
  const isRu = locale === "ru";
  return <section className="content-page"><header className="page-intro"><p className="eyebrow">{isRu ? "Команда" : "Команда"}</p><h1>{isRu ? "Мастера — пока только роли" : "Шеберлер — әзірге тек рөлдер"}</h1><p className="lede">{isRu ? "Пока представлены профессиональные роли. Реальные имена, биографии и смены не придуманы." : "Әзірге кәсіби рөлдер көрсетілген. Нақты есімдер, өмірбаяндар және ауысымдар ойдан шығарылмаған."}</p></header><div className="masters-grid">{specialists.map((specialist) => <article className="master-card reveal" key={specialist.id}><div className="master-image"><Image src={specialist.image} alt={isRu ? "Иллюстративный портрет, не реальный сотрудник" : "Иллюстрациялық портрет, нақты қызметкер емес"} fill sizes="(max-width: 720px) 100vw, 33vw" /></div><p className="eyebrow">{isRu ? "Роль специалиста" : "Маман рөлі"}</p><h2>{specialist.role[locale]}</h2><div className="master-meta"><span><Users aria-hidden="true" /> {specialist.compatibleModes.includes("six-hands") ? (isRu ? "4/6 рук" : "4/6 қол") : (isRu ? "обычный / 4 руки" : "кәдімгі / 4 қол")}</span><span><Clock3 aria-hidden="true" /> {specialist.demoIntervals.join(" · ")}</span></div><small>{isRu ? "Интервалы иллюстративные, не реальная доступность." : "Аралықтар иллюстрациялық, нақты қолжетімділік емес."}</small></article>)}</div><div className="center-cta"><Link className="button button-dark" href={`/${locale}/booking`}>{isRu ? "Открыть онлайн-запись" : "Онлайн-жазылуды ашу"}</Link></div></section>;
}
