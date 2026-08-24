"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/types/booking";

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const nextLocale: Locale = locale === "ru" ? "kz" : "ru";
  const nextPath = pathname.replace(/^\/(ru|kz)(?=\/|$)/, `/${nextLocale}`);

  return (
    <Link
      className="language-switch"
      href={nextPath || `/${nextLocale}`}
      hrefLang={nextLocale === "kz" ? "kk" : "ru"}
      onClick={() => window.localStorage.setItem("zolushka-language", nextLocale)}
      aria-label={locale === "ru" ? "Қазақ тіліне ауысу" : "Переключить на русский язык"}
    >
      {locale === "ru" ? "KZ" : "RU"}
    </Link>
  );
}
