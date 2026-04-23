import fs from "fs";
import path from "path";
import {
  GalleryItem,
  ContactMessage,
  Appointment,
  AnalyticsEvent,
  StudioSettings,
} from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");

const defaultSettings: StudioSettings = {
  name: "Seven Tattoo",
  tagline: "Arte na pele, para sempre",
  description:
    "Estúdio privado de tatuagem localizado em Duque de Caxias, RJ. Especializado em criações únicas e personalizadas.",
  address: "Rua Erne - Duque de Caxias, RJ",
  phone: "+55 21 96581-3894",
  email: "",
  instagram: "https://www.instagram.com/seventattoo_ofc/",
  facebook: "https://www.facebook.com/profile.php?id=100028099554525",
  whatsapp: "https://api.whatsapp.com/send?phone=%2B5521965813894",
  tiktok: "https://www.tiktok.com/@7seventattoo",
  about: {
    title: "Sobre Nós",
    content:
      "A Seven Tattoo é um estúdio privado de tatuagem fundado por Geovanny Freitas, localizado em Duque de Caxias, RJ. Com dedicação à arte e ao cliente, cada tatuagem é criada com cuidado e personalidade. Orçamentos e agendamentos pelo direct do Instagram @seventattoo_ofc.",
  },
  businessHours: {
    "Segunda-Sexta": "10:00 - 20:00",
    Sábado: "10:00 - 18:00",
    Domingo: "Fechado",
  },
};

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(filename: string, defaultValue: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    writeJsonFile(filename, defaultValue);
    return defaultValue;
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempPath, filePath);
}

// Gallery
export function getGallery(): GalleryItem[] {
  return readJsonFile<GalleryItem[]>("gallery.json", []);
}

export function getPublicGallery(): GalleryItem[] {
  return getGallery().filter((item) => item.visible);
}

export function getGalleryItem(id: string): GalleryItem | undefined {
  return getGallery().find((item) => item.id === id);
}

export function saveGalleryItem(item: GalleryItem): void {
  const gallery = getGallery();
  const index = gallery.findIndex((g) => g.id === item.id);
  if (index >= 0) {
    gallery[index] = item;
  } else {
    gallery.unshift(item);
  }
  writeJsonFile("gallery.json", gallery);
}

export function deleteGalleryItem(id: string): boolean {
  const gallery = getGallery();
  const filtered = gallery.filter((item) => item.id !== id);
  if (filtered.length === gallery.length) return false;
  writeJsonFile("gallery.json", filtered);
  return true;
}

// Messages
export function getMessages(): ContactMessage[] {
  return readJsonFile<ContactMessage[]>("messages.json", []);
}

export function getMessage(id: string): ContactMessage | undefined {
  return getMessages().find((m) => m.id === id);
}

export function saveMessage(message: ContactMessage): void {
  const messages = getMessages();
  const index = messages.findIndex((m) => m.id === message.id);
  if (index >= 0) {
    messages[index] = message;
  } else {
    messages.unshift(message);
  }
  writeJsonFile("messages.json", messages);
}

export function deleteMessage(id: string): boolean {
  const messages = getMessages();
  const filtered = messages.filter((m) => m.id !== id);
  if (filtered.length === messages.length) return false;
  writeJsonFile("messages.json", filtered);
  return true;
}

// Appointments
export function getAppointments(): Appointment[] {
  return readJsonFile<Appointment[]>("appointments.json", []);
}

export function getAppointment(id: string): Appointment | undefined {
  return getAppointments().find((a) => a.id === id);
}

export function saveAppointment(appointment: Appointment): void {
  const appointments = getAppointments();
  const index = appointments.findIndex((a) => a.id === appointment.id);
  if (index >= 0) {
    appointments[index] = appointment;
  } else {
    appointments.unshift(appointment);
  }
  writeJsonFile("appointments.json", appointments);
}

export function deleteAppointment(id: string): boolean {
  const appointments = getAppointments();
  const filtered = appointments.filter((a) => a.id !== id);
  if (filtered.length === appointments.length) return false;
  writeJsonFile("appointments.json", filtered);
  return true;
}

// Analytics
export function getAnalytics(): AnalyticsEvent[] {
  return readJsonFile<AnalyticsEvent[]>("analytics.json", []);
}

export function saveAnalyticsEvent(event: AnalyticsEvent): void {
  const analytics = getAnalytics();
  analytics.push(event);
  // Keep last 10,000 events
  const trimmed = analytics.slice(-10000);
  writeJsonFile("analytics.json", trimmed);
}

// Settings
export function getSettings(): StudioSettings {
  return readJsonFile<StudioSettings>("settings.json", defaultSettings);
}

export function saveSettings(settings: StudioSettings): void {
  writeJsonFile("settings.json", settings);
}
