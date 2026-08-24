import { serviceById, services } from "@/data/services";
import { specialists } from "@/data/specialists";
import type {
  BookingDraft,
  BookingMode,
  BookingProvider,
  BookingResult,
  ServiceCombination,
  Specialist,
  SpecialistQuery,
  SlotQuery,
  TimeSlot,
} from "@/types/booking";

const wait = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

const modeCapacity: Record<BookingMode, number> = {
  single: 6,
  "four-hands": 2,
  "six-hands": 3,
};

const parallelGroups = (serviceIds: string[]) =>
  serviceIds.map((id) => {
    const category = serviceById.get(id)?.category;
    if (category === "manicure" || category === "halal" || category === "men") return "hands";
    if (category === "pedicure") return "feet";
    return "face";
  });

export class DemoBookingProvider implements BookingProvider {
  async getServices() {
    await wait();
    return services;
  }

  async getCompatibleCombinations(
    serviceIds: string[],
    mode: BookingMode = serviceIds.length >= 3 ? "six-hands" : serviceIds.length === 2 ? "four-hands" : "single",
  ): Promise<ServiceCombination> {
    await wait(120);
    const selected = serviceIds.map((id) => serviceById.get(id)).filter(Boolean);
    const groups = parallelGroups(serviceIds);
    const duplicateGroup = mode !== "single" && new Set(groups).size !== groups.length;
    const missing = selected.length !== serviceIds.length;
    const overCapacity = serviceIds.length > modeCapacity[mode];
    const parallelCountMismatch =
      (mode === "four-hands" && serviceIds.length !== 2) ||
      (mode === "six-hands" && (serviceIds.length < 2 || serviceIds.length > 3));
    const unsupported = selected.some((service) => !service?.compatibleModes.includes(mode));
    const compatible = Boolean(serviceIds.length) && !missing && !overCapacity && !duplicateGroup && !parallelCountMismatch && !unsupported;
    const estimatedPrice = selected.reduce((sum, service) => sum + (service?.price ?? 0), 0);
    const durations = selected.map((service) => service?.durationMinutes ?? 0);
    const estimatedDurationMinutes =
      mode === "single" ? durations.reduce((sum, value) => sum + value, 0) : Math.max(0, ...durations);

    let reason = {
      ru: "Комбинация подходит для выбранного формата. Финальный состав и время подтверждает администратор.",
      kz: "Комбинация таңдалған форматқа сай. Соңғы құрам мен уақытты әкімші растайды.",
    };
    let alternative: ServiceCombination["alternative"];

    if (!serviceIds.length) {
      reason = { ru: "Выберите хотя бы одну услугу.", kz: "Кемінде бір қызмет таңдаңыз." };
    } else if (duplicateGroup) {
      reason = {
        ru: "Эти услуги требуют одного рабочего направления и не выполняются параллельно в локальной таблице.",
        kz: "Бұл қызметтер бір жұмыс бағытын қажет етеді және жергілікті кестеде қатар орындалмайды.",
      };
      alternative = {
        ru: "Оставьте по одной услуге для рук, ног и зоны бровей/ресниц либо выберите обычную запись.",
        kz: "Қол, аяқ және қас/кірпік аймағына бір қызметтен қалдырыңыз немесе кәдімгі жазылуды таңдаңыз.",
      };
    } else if (parallelCountMismatch || overCapacity) {
      reason = {
        ru: mode === "four-hands" ? "Для формата в 4 руки выберите ровно две совместимые услуги." : "Для формата в 6 рук выберите две или три совместимые услуги.",
        kz: mode === "four-hands" ? "4 қол форматына дәл екі үйлесімді қызмет таңдаңыз." : "6 қол форматына екі немесе үш үйлесімді қызмет таңдаңыз.",
      };
      alternative = { ru: "Измените формат или количество услуг.", kz: "Форматты немесе қызмет санын өзгертіңіз." };
    } else if (unsupported) {
      reason = { ru: "Одна из услуг доступна только в обычном формате.", kz: "Қызметтердің бірі тек кәдімгі форматта қолжетімді." };
      alternative = { ru: "Выберите обычную запись для этой услуги.", kz: "Бұл қызмет үшін кәдімгі жазылуды таңдаңыз." };
    }

    return {
      serviceIds,
      mode,
      compatible,
      reason,
      alternative,
      estimatedPrice,
      estimatedDurationMinutes,
      durationIsDemo: true,
    };
  }

  async getSpecialists({ serviceIds, mode }: SpecialistQuery): Promise<Specialist[]> {
    await wait();
    if (mode !== "single") {
      const required = new Set(serviceIds.map((id) => serviceById.get(id)?.specialization));
      return specialists.filter((specialist) => required.has(specialist.specialization) && specialist.compatibleModes.includes(mode));
    }
    return specialists.filter(
      (specialist) => specialist.compatibleModes.includes(mode) && serviceIds.every((id) => specialist.serviceIds.includes(id)),
    );
  }

  async getAvailableSlots({ date }: SlotQuery): Promise<TimeSlot[]> {
    await wait(220);
    if (!date) return [];
    const now = new Date();
    const selectedDay = new Date(`${date}T00:00:00`);
    const isToday = selectedDay.toDateString() === now.toDateString();
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour < 21; hour += 1) {
      for (const minute of [0, 30]) {
        const label = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        const slotDate = new Date(`${date}T${label}:00`);
        slots.push({
          id: `${date}-${label}`,
          startsAt: slotDate.toISOString(),
          label,
          available: !isToday || slotDate.getTime() > now.getTime(),
          demoData: true,
        });
      }
    }
    return slots;
  }

  async createBooking(data: BookingDraft): Promise<BookingResult> {
    void data;
    await wait(500);
    return {
      demo: true,
      submitted: false,
      message: {
        ru: "Сейчас заявка не отправляется. После подключения системы салон получит её, подтвердит время и отправит напоминание перед визитом.",
        kz: "Қазір өтінім жіберілмейді. Жүйе қосылғаннан кейін салон оны алып, уақытты растап, келу алдында еске салу жібереді.",
      },
    };
  }
}

export const bookingProvider: BookingProvider = new DemoBookingProvider();
