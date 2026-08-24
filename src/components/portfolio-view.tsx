import Image from "next/image";
import { portfolioItems } from "@/data/portfolio";
import type { Locale } from "@/types/booking";

export function PortfolioView({ locale }: { locale: Locale }) {
  const isRu = locale === "ru";
  return <section className="content-page"><header className="page-intro"><p className="eyebrow">illustrativeImage: true</p><h1>{isRu ? "Портфолио-направление" : "Портфолио бағыты"}</h1><p className="lede">{isRu ? "Все изображения иллюстративные и не являются фотографиями работ салона." : "Барлық сурет иллюстрациялық және салон жұмыстарының фотосы емес."}</p></header><div className="portfolio-full">{portfolioItems.map((item, index) => <figure key={`${item.id}-${index}`} className="motion-image"><Image src={item.image} alt={item.alt[locale]} fill sizes="(max-width: 720px) 100vw, 33vw" /><figcaption><strong>{item.category[locale]}</strong><span>{isRu ? "Иллюстративное изображение" : "Иллюстрациялық сурет"}</span></figcaption></figure>)}</div></section>;
}
