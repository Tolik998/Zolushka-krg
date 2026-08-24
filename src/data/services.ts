import type {
  BookingMode,
  LocalizedText,
  Service,
  ServiceCategory,
  Specialization,
} from "@/types/booking";

export const categoryNames: Record<ServiceCategory, LocalizedText> = {
  manicure: { ru: "Маникюр", kz: "Маникюр" },
  pedicure: { ru: "Педикюр", kz: "Педикюр" },
  lamination: { ru: "Ламинирование", kz: "Ламинация" },
  brows: { ru: "Брови", kz: "Қас" },
  halal: { ru: "Халяльные процедуры", kz: "Халал процедуралар" },
  lashes: { ru: "Ресницы", kz: "Кірпік" },
  men: { ru: "Для мужчин", kz: "Ерлерге арналған" },
};

const categoryDescriptions: Record<ServiceCategory, LocalizedText> = {
  manicure: {
    ru: "Уход за ногтями и покрытие по выбранному формату.",
    kz: "Таңдалған форматтағы тырнақ күтімі және жабын.",
  },
  pedicure: {
    ru: "Педикюр или отдельная обработка по выбранной услуге.",
    kz: "Таңдалған қызметке сай педикюр немесе жеке өңдеу.",
  },
  lamination: {
    ru: "Услуга для ресниц или бровей без медицинских обещаний.",
    kz: "Медициналық уәделерсіз кірпікке немесе қасқа арналған қызмет.",
  },
  brows: {
    ru: "Коррекция, окрашивание или уход по прайсу салона.",
    kz: "Салон бағасы бойынша түзету, бояу немесе күтім.",
  },
  halal: {
    ru: "Процедура из отдельной категории прайса салона.",
    kz: "Салон бағасындағы жеке санатқа кіретін процедура.",
  },
  lashes: {
    ru: "Отдельная услуга для ресниц по актуальному прайсу.",
    kz: "Өзекті баға бойынша кірпікке арналған жеке қызмет.",
  },
  men: {
    ru: "Услуга из мужского раздела прайса.",
    kz: "Бағаның ерлерге арналған бөліміндегі қызмет.",
  },
};

type ServiceSeed = readonly [
  slug: string,
  category: ServiceCategory,
  ru: string,
  kz: string,
  price: number,
  priceFrom: boolean,
  duration: number,
  popular?: boolean,
];

const seeds: ServiceSeed[] = [
  ["hygienic-manicure", "manicure", "Гигиенический маникюр", "Гигиеналық маникюр", 5500, false, 60, true],
  ["hygienic-manicure-polish", "manicure", "Гигиенический маникюр + лак", "Гигиеналық маникюр + лак", 6000, false, 75],
  ["gel-polish-one-tone", "manicure", "Маникюр + гель-лак в один тон", "Маникюр + бір түсті гель-лак", 9000, false, 120, true],
  ["allergy-coating", "manicure", "Аллергопокрытие", "Аллергияға бейім жабын", 9000, false, 120],
  ["extensions-length-1", "manicure", "Наращивание ногтей, первая длина", "Тырнақ ұзарту, бірінші ұзындық", 12000, false, 150],
  ["extensions-length-2", "manicure", "Наращивание ногтей, вторая длина", "Тырнақ ұзарту, екінші ұзындық", 13000, false, 165],
  ["extensions-length-3", "manicure", "Наращивание ногтей, третья длина", "Тырнақ ұзарту, үшінші ұзындық", 14000, false, 180],
  ["extensions-length-4", "manicure", "Наращивание ногтей, четвёртая длина", "Тырнақ ұзарту, төртінші ұзындық", 15000, false, 195],
  ["extensions-length-5", "manicure", "Наращивание ногтей, пятая длина", "Тырнақ ұзарту, бесінші ұзындық", 16000, false, 210],
  ["removal-shaping", "manicure", "Снятие с опилом формы", "Жабынды алып, пішіндеу", 1500, false, 30],
  ["external-removal-with-coating", "manicure", "Чужое снятие с последующим покрытием", "Басқа жабынды алып, қайта жабу", 1000, false, 30],
  ["repair-during-correction", "manicure", "Ремонт одного ногтя во время коррекции", "Түзету кезінде бір тырнақты жөндеу", 300, false, 15],
  ["repair-one-nail", "manicure", "Ремонт одного ногтя отдельно", "Бір тырнақты жеке жөндеу", 1000, false, 20],
  ["extend-one-during", "manicure", "Наращивание одного ногтя во время процедуры", "Процедура кезінде бір тырнақты ұзарту", 500, true, 20],
  ["extend-one-separate", "manicure", "Наращивание одного ногтя отдельно", "Бір тырнақты жеке ұзарту", 2000, true, 30],
  ["design-up-to-five", "manicure", "Дизайн до пяти ногтей", "Бес тырнаққа дейін дизайн", 500, true, 20],
  ["design-five-to-ten", "manicure", "Дизайн от пяти до десяти ногтей", "Бестен он тырнаққа дейін дизайн", 1000, true, 30],
  ["paraffin-therapy", "manicure", "Парафинотерапия", "Парафинотерапия", 1000, true, 30],
  ["hygienic-full-pedicure", "pedicure", "Гигиенический полный педикюр", "Толық гигиеналық педикюр", 9000, true, 90, true],
  ["full-pedicure-coating", "pedicure", "Полный педикюр с покрытием в один тон", "Бір түсті жабындысы бар толық педикюр", 10000, true, 120, true],
  ["toes-pedicure-coating", "pedicure", "Педикюр пальчиков с покрытием", "Саусақтарға жабындысы бар педикюр", 8500, true, 90],
  ["toes-hygienic", "pedicure", "Гигиеническая обработка пальчиков", "Саусақтарды гигиеналық өңдеу", 8000, true, 75],
  ["heels-only", "pedicure", "Обработка пяток отдельно", "Өкшені жеке өңдеу", 2000, true, 40],
  ["toe-design-up-to-five", "pedicure", "Дизайн до пяти пальцев", "Бес саусаққа дейін дизайн", 500, true, 20],
  ["toe-design-five-to-ten", "pedicure", "Дизайн от пяти до десяти пальцев", "Бестен он саусаққа дейін дизайн", 1000, true, 30],
  ["pedicure-external-removal-with", "pedicure", "Снятие чужого покрытия с последующей процедурой", "Басқа жабынды алып, кейін процедура жасау", 1000, false, 30],
  ["pedicure-external-removal-only", "pedicure", "Снятие чужого покрытия без последующей процедуры", "Басқа жабынды кейінгі процедурасыз алу", 1500, false, 30],
  ["diva-complex", "lamination", "Комплекс «Дива»", "«Дива» кешені", 15000, false, 120, true],
  ["top-complex", "lamination", "Комплекс «Топ»", "«Топ» кешені", 12000, false, 100],
  ["brows-lami-complex", "lamination", "Комплекс Brows Lami", "Brows Lami кешені", 9000, false, 90],
  ["lash-lamination", "lamination", "Ламинирование ресниц", "Кірпікті ламинациялау", 8000, false, 75, true],
  ["lower-lash-lamination", "lamination", "Ламинирование нижних ресниц", "Төменгі кірпікті ламинациялау", 6000, false, 60],
  ["upper-lower-lamination", "lamination", "Ламинирование верхних и нижних ресниц", "Жоғарғы және төменгі кірпікті ламинациялау", 13000, false, 105],
  ["brow-lamination", "lamination", "Ламинирование бровей", "Қасты ламинациялау", 5000, false, 60],
  ["brows-complex", "brows", "Комплекс Brows", "Brows кешені", 6000, false, 60, true],
  ["brow-correction", "brows", "Коррекция бровей", "Қасты түзету", 4000, false, 40],
  ["brow-coloring", "brows", "Окрашивание бровей", "Қасты бояу", 3000, false, 35],
  ["brow-spa", "brows", "SPA для бровей", "Қасқа арналған SPA", 2000, false, 30],
  ["brow-happiness", "brows", "«Счастье для бровей»", "«Қас бақыты»", 1000, false, 20],
  ["japanese-manicure", "halal", "Японский маникюр", "Жапон маникюрі", 7500, false, 75, true],
  ["muslim-complex", "halal", "Комплекс «Муслим»", "«Муслим» кешені", 15000, false, 120],
  ["muslim-brows", "halal", "«Муслим Брови»", "«Муслим Қас»", 9000, false, 75],
  ["lash-coloring", "lashes", "Окрашивание ресниц", "Кірпікті бояу", 1000, false, 25],
  ["lash-botox", "lashes", "Ботокс ресниц", "Кірпік ботоксы", 1000, false, 25],
  ["lash-extension-removal", "lashes", "Снятие наращённых ресниц", "Ұзартылған кірпікті алу", 3000, false, 35],
  ["mens-brow-correction", "men", "Мужская коррекция бровей", "Ерлер қасын түзету", 5000, false, 45],
  ["mens-manicure", "men", "Мужской маникюр", "Ерлер маникюрі", 6000, false, 60],
  ["mens-manicure-coating", "men", "Мужской маникюр с покрытием", "Жабындысы бар ерлер маникюрі", 10000, false, 105],
];

const imageFor = (category: ServiceCategory) =>
  category === "brows" || category === "lashes" || category === "lamination"
    ? "/images/beauty-portrait.png"
    : category === "pedicure"
      ? "/images/salon-parallel-interior.png"
      : "/images/portfolio-micro-french.png";

const specializationFor = (category: ServiceCategory): Specialization => {
  if (category === "pedicure") return "pedicure-master";
  if (category === "brows") return "brow-master";
  if (category === "lashes" || category === "lamination") return "lash-master";
  if (category === "men" || category === "halal") return "universal-master";
  return "manicure-master";
};

const modesFor = (category: ServiceCategory): BookingMode[] =>
  category === "men" ? ["single"] : ["single", "four-hands", "six-hands"];

export const services: Service[] = seeds.map(
  ([slug, category, ru, kz, price, priceFrom, durationMinutes, isPopular = false]) => ({
    id: `service-${slug}`,
    slug,
    name: { ru, kz },
    description: categoryDescriptions[category],
    category,
    durationMinutes,
    durationIsDemo: true,
    price,
    priceFrom,
    image: imageFor(category),
    illustrativeImage: true,
    compatibleModes: modesFor(category),
    specialization: specializationFor(category),
    needsReview: true,
    isPopular,
    source: "2gis-price-2026-01-31",
  }),
);

export const serviceById = new Map(services.map((service) => [service.id, service]));

export const formatPrice = (service: Pick<Service, "price" | "priceFrom">, locale: "ru" | "kz") =>
  `${service.priceFrom ? (locale === "ru" ? "от " : "бастап ") : ""}${new Intl.NumberFormat("ru-RU").format(service.price)} ₸`;
