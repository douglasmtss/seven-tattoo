import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .max(20, "Telefone muito longo")
    .regex(/^[\d\s()\-+]+$/, "Telefone inválido"),
  message: z
    .string()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres")
    .max(1000, "Mensagem muito longa"),
});

export const appointmentSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .max(20, "Telefone muito longo")
    .regex(/^[\d\s()\-+]+$/, "Telefone inválido"),
  description: z
    .string()
    .min(10, "Descreva sua tatuagem com pelo menos 10 caracteres")
    .max(500, "Descrição muito longa"),
  placement: z
    .string()
    .min(2, "Informe o local da tatuagem")
    .max(100, "Muito longo"),
  size: z.enum(["small", "medium", "large", "extra-large"]),
  preferredDate: z.string().min(1, "Informe uma data de preferência"),
});

export const galleryItemSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100),
  description: z.string().max(500).optional().default(""),
  category: z.string().min(1, "Categoria é obrigatória").max(50),
  visible: z.boolean().optional().default(true),
});

export const settingsSchema = z.object({
  name: z.string().min(1).max(100),
  tagline: z.string().max(200).optional().default(""),
  description: z.string().max(1000).optional().default(""),
  address: z.string().max(200).optional().default(""),
  phone: z.string().max(30).optional().default(""),
  email: z
    .string()
    .refine(
      (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      { message: "Email inválido" }
    )
    .optional()
    .default(""),
  instagram: z.string().max(200).optional().default(""),
  facebook: z.string().max(200).optional().default(""),
  whatsapp: z.string().max(200).optional().default(""),
  tiktok: z.string().max(200).optional().default(""),
  about: z.object({
    title: z.string().max(100).optional().default(""),
    content: z.string().max(2000).optional().default(""),
  }),
  businessHours: z.record(z.string(), z.string()).optional().default({}),
});

export const messageReplySchema = z.object({
  reply: z
    .string()
    .min(1, "Resposta é obrigatória")
    .max(2000, "Resposta muito longa"),
});

export const appointmentStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "completed"]),
  notes: z.string().max(1000).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type MessageReplyInput = z.infer<typeof messageReplySchema>;
export type AppointmentStatusInput = z.infer<typeof appointmentStatusSchema>;
