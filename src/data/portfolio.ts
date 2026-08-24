import type { LocalizedText } from "@/types/booking";

export interface PortfolioItem {
  id: string;
  category: LocalizedText;
  image: string;
  alt: LocalizedText;
  illustrativeImage: true;
}

export const portfolioItems: PortfolioItem[] = [
  ["minimal", "Минимализм", "Минимализм", "/images/hero-nude-manicure.png", "Нюдовый маникюр", "Нюд маникюр"],
  ["french", "Френч", "Френч", "/images/portfolio-micro-french.png", "Микро-френч", "Микро-френч"],
  ["nude", "Нюд", "Нюд", "/images/hero-nude-manicure.png", "Естественный нюд", "Табиғи нюд"],
  ["design", "Дизайн", "Дизайн", "/images/portfolio-micro-french.png", "Сдержанный дизайн", "Ұстамды дизайн"],
  ["extensions", "Наращивание", "Ұзарту", "/images/portfolio-micro-french.png", "Аккуратная форма ногтей", "Ұқыпты тырнақ пішіні"],
  ["pedicure", "Педикюр", "Педикюр", "/images/salon-parallel-interior.png", "Иллюстративное направление педикюра", "Педикюрдің иллюстрациялық бағыты"],
  ["brows", "Брови", "Қас", "/images/beauty-portrait.png", "Естественное оформление бровей", "Қасты табиғи әрлеу"],
  ["lashes", "Ресницы", "Кірпік", "/images/beauty-portrait.png", "Естественный акцент на ресницах", "Кірпікке табиғи екпін"],
].map(([id, ru, kz, image, altRu, altKz]) => ({
  id,
  category: { ru, kz },
  image,
  alt: { ru: altRu, kz: altKz },
  illustrativeImage: true,
}));
