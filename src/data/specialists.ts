import type { Specialist } from "@/types/booking";
import { services } from "./services";

const idsFor = (specialization: Specialist["specialization"]) =>
  services.filter((service) => service.specialization === specialization).map((service) => service.id);

export const specialists: Specialist[] = [
  {
    id: "demo-manicure-master",
    role: { ru: "Мастер маникюра", kz: "Маникюр шебері" },
    specialization: "manicure-master",
    serviceIds: idsFor("manicure-master"),
    compatibleModes: ["single", "four-hands", "six-hands"],
    demoIntervals: ["08:30", "11:00", "15:30"],
    image: "/images/beauty-portrait.png",
    illustrativeImage: true,
    demoData: true,
  },
  {
    id: "demo-pedicure-master",
    role: { ru: "Мастер педикюра", kz: "Педикюр шебері" },
    specialization: "pedicure-master",
    serviceIds: idsFor("pedicure-master"),
    compatibleModes: ["single", "four-hands", "six-hands"],
    demoIntervals: ["09:00", "12:30", "17:00"],
    image: "/images/beauty-portrait.png",
    illustrativeImage: true,
    demoData: true,
  },
  {
    id: "demo-brow-master",
    role: { ru: "Бровист", kz: "Қас шебері" },
    specialization: "brow-master",
    serviceIds: idsFor("brow-master"),
    compatibleModes: ["single", "four-hands", "six-hands"],
    demoIntervals: ["10:00", "14:00", "18:30"],
    image: "/images/beauty-portrait.png",
    illustrativeImage: true,
    demoData: true,
  },
  {
    id: "demo-lash-master",
    role: { ru: "Lash-мастер", kz: "Кірпік шебері" },
    specialization: "lash-master",
    serviceIds: idsFor("lash-master"),
    compatibleModes: ["single", "four-hands", "six-hands"],
    demoIntervals: ["08:00", "13:00", "19:00"],
    image: "/images/beauty-portrait.png",
    illustrativeImage: true,
    demoData: true,
  },
  {
    id: "demo-universal-master",
    role: { ru: "Универсальный мастер", kz: "Әмбебап шебер" },
    specialization: "universal-master",
    serviceIds: idsFor("universal-master"),
    compatibleModes: ["single", "four-hands"],
    demoIntervals: ["09:30", "16:00", "20:00"],
    image: "/images/beauty-portrait.png",
    illustrativeImage: true,
    demoData: true,
  },
];
