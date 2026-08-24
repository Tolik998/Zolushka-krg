import Image from "next/image";
import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { contactLinks } from "@/lib/i18n";
import type { Locale } from "@/types/booking";

export function Footer({ locale }: { locale: Locale }) {
  const isRu = locale === "ru";
  return (
    <footer className="site-footer" id="contacts">
      <div className="footer-cta">
        <p>{isRu ? "Красота, для которой находится время" : "Уақыт табылатын сұлулық"}</p>
        <h2>{isRu ? "Выберите свой формат визита" : "Өзіңізге ыңғайлы форматты таңдаңыз"}</h2>
        <div className="button-row">
          <Link className="button button-cobalt" href={`/${locale}/booking`}>{isRu ? "Онлайн-запись" : "Онлайн-жазылу"}</Link>
          <a className="button button-ghost-light" href={contactLinks.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>
      <div className="footer-grid">
        <div>
          <Image className="footer-logo" src="/images/zolushka-logo.png" alt="Zolushka Beauty Zone" width={112} height={112} />
          <strong className="footer-brand">Zolushka.krg</strong>
          <p>{isRu ? "Салон красоты и ногтевая студия" : "Сұлулық салоны және тырнақ студиясы"}</p>
        </div>
        <address>
          <a href={contactLinks.route} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" /> {isRu ? "улица Лободы, 4, Караганда" : "Лобода көшесі, 4, Қарағанды"}</a>
          <a href={contactLinks.tel}><Phone aria-hidden="true" /> +7 707 585 62 73</a>
          <a href={contactLinks.email}><Mail aria-hidden="true" /> wj_foxy@mail.ru</a>
        </address>
        <div className="footer-links">
          <a href={contactLinks.whatsapp} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> WhatsApp</a>
          <a href={contactLinks.instagram} target="_blank" rel="noreferrer"><Instagram aria-hidden="true" /> @zolushka.krg</a>
          <a href={contactLinks.twoGis} target="_blank" rel="noreferrer">2ГИС</a>
          <Link href={`/${locale}/privacy`}>{isRu ? "Политика конфиденциальности" : "Құпиялық саясаты"}</Link>
        </div>
      </div>
      <p className="footer-note">
        {isRu ? "Изображения портфолио и мастеров иллюстративные." : "Портфолио мен шеберлердің суреттері иллюстрациялық."}
      </p>
    </footer>
  );
}
