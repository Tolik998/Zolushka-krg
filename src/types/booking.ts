export type Locale = "ru" | "kz";
export type LocalizedText = { ru: string; kz: string };

export type ServiceCategory =
  | "manicure"
  | "pedicure"
  | "lamination"
  | "brows"
  | "halal"
  | "lashes"
  | "men";

export type Specialization =
  | "manicure-master"
  | "pedicure-master"
  | "brow-master"
  | "lash-master"
  | "universal-master";

export type BookingMode = "single" | "four-hands" | "six-hands";

export interface Service {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  category: ServiceCategory;
  durationMinutes: number;
  durationIsDemo: true;
  price: number;
  priceFrom: boolean;
  image: string;
  illustrativeImage: true;
  compatibleModes: BookingMode[];
  specialization: Specialization;
  needsReview: true;
  isPopular: boolean;
  source: "2gis-price-2026-01-31";
}

export interface ServiceCombination {
  serviceIds: string[];
  mode: BookingMode;
  compatible: boolean;
  reason: LocalizedText;
  alternative?: LocalizedText;
  estimatedPrice: number;
  estimatedDurationMinutes: number;
  durationIsDemo: true;
}

export interface Specialist {
  id: string;
  role: LocalizedText;
  specialization: Specialization;
  serviceIds: string[];
  compatibleModes: BookingMode[];
  demoIntervals: string[];
  image: string;
  illustrativeImage: true;
  demoData: true;
}

export interface TimeSlot {
  id: string;
  startsAt: string;
  label: string;
  available: boolean;
  demoData: true;
}

export interface BookingDraft {
  mode: BookingMode;
  serviceIds: string[];
  specialistId: string | null;
  date: string;
  time: string;
  name: string;
  phone: string;
  comment: string;
}

export interface BookingResult {
  demo: true;
  submitted: false;
  message: LocalizedText;
}

export interface SpecialistQuery {
  serviceIds: string[];
  mode: BookingMode;
}

export interface SlotQuery extends SpecialistQuery {
  specialistId: string | null;
  date: string;
}

export interface BookingProvider {
  getServices(): Promise<Service[]>;
  getCompatibleCombinations(
    serviceIds: string[],
    mode?: BookingMode,
  ): Promise<ServiceCombination>;
  getSpecialists(params: SpecialistQuery): Promise<Specialist[]>;
  getAvailableSlots(params: SlotQuery): Promise<TimeSlot[]>;
  createBooking(data: BookingDraft): Promise<BookingResult>;
}
