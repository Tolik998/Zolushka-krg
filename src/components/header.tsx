import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { copy } from "@/lib/i18n";
import type { Locale } from "@/types/booking";
import { LanguageSwitch } from "./language-switch";

export function Header({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const links = [
    ["", t.nav.home],
    ["/services", t.nav.services],
    ["/express", t.nav.express],
    ["/booking", t.nav.booking],
    ["/masters", t.nav.masters],
    ["/portfolio", t.nav.portfolio],
    ["#contacts", t.nav.contacts],
  ];

  return (
    <header className="site-header">
      <a className="skip-link" href="#main">{locale === "ru" ? "К содержанию" : "Мазмұнға өту"}</a>
      <div className="header-shell">
        <Link className="wordmark" href={`/${locale}`} aria-label="Zolushka Beauty Zone — главная">
          <Image src="/images/zolushka-logo.png" alt="Zolushka Beauty Zone" width={72} height={72} loading="eager" />
        </Link>
        <nav className="desktop-nav" aria-label={locale === "ru" ? "Основная навигация" : "Негізгі навигация"}>
          {links.slice(1, 6).map(([href, label]) => <Link key={href} href={`/${locale}${href}`}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <LanguageSwitch locale={locale} />
          <Link className="button button-dark header-book" href={`/${locale}/booking`}>{t.book}</Link>
          <details className="mobile-menu">
            <summary aria-label={locale === "ru" ? "Открыть меню" : "Мәзірді ашу"}><Menu aria-hidden="true" size={22} /></summary>
            <nav aria-label={locale === "ru" ? "Мобильная навигация" : "Мобильді навигация"}>
              {links.map(([href, label]) => <Link key={href} href={`/${locale}${href}`}>{label}</Link>)}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
