export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  visible: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
  replied: boolean;
  reply?: string;
  repliedAt?: string;
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  placement: string;
  size: "small" | "medium" | "large" | "extra-large";
  preferredDate: string;
  status: "pending" | "approved" | "rejected" | "completed";
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  type:
    | "pageview"
    | "contact_form"
    | "gallery_view"
    | "appointment_request"
    | "whatsapp_click";
  page: string;
  referrer: string;
  userAgent: string;
  timestamp: string;
}

export interface StudioSettings {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  tiktok: string;
  about: {
    title: string;
    content: string;
  };
  businessHours: {
    [day: string]: string;
  };
}

export interface DashboardStats {
  totalMessages: number;
  unreadMessages: number;
  totalAppointments: number;
  pendingAppointments: number;
  totalGalleryItems: number;
  totalPageViews: number;
  weeklyPageViews: number;
  topPages: { page: string; views: number }[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type AppointmentSize = Appointment["size"];
export type AppointmentStatus = Appointment["status"];
export type EventType = AnalyticsEvent["type"];
