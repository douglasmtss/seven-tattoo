import {
  contactSchema,
  appointmentSchema,
  galleryItemSchema,
  settingsSchema,
  messageReplySchema,
  appointmentStatusSchema,
} from "@/lib/validations";

describe("contactSchema", () => {
  const validContact = {
    name: "João Silva",
    email: "joao@example.com",
    phone: "21965813894",
    message: "Quero fazer uma tatuagem no braço.",
  };

  it("should parse valid contact data", () => {
    const result = contactSchema.safeParse(validContact);
    expect(result.success).toBe(true);
  });

  it("should fail when name is too short", () => {
    const result = contactSchema.safeParse({ ...validContact, name: "J" });
    expect(result.success).toBe(false);
  });

  it("should fail when name is empty", () => {
    const result = contactSchema.safeParse({ ...validContact, name: "" });
    expect(result.success).toBe(false);
  });

  it("should fail for invalid email", () => {
    const result = contactSchema.safeParse({ ...validContact, email: "invalid" });
    expect(result.success).toBe(false);
  });

  it("should fail for phone too short", () => {
    const result = contactSchema.safeParse({ ...validContact, phone: "12345" });
    expect(result.success).toBe(false);
  });

  it("should fail for phone with letters", () => {
    const result = contactSchema.safeParse({ ...validContact, phone: "abcdefghij" });
    expect(result.success).toBe(false);
  });

  it("should fail when message is too short", () => {
    const result = contactSchema.safeParse({ ...validContact, message: "short" });
    expect(result.success).toBe(false);
  });

  it("should fail when required fields are missing", () => {
    const result = contactSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should fail when name is undefined", () => {
    const result = contactSchema.safeParse({ ...validContact, name: undefined });
    expect(result.success).toBe(false);
  });
});

describe("appointmentSchema", () => {
  const validAppointment = {
    name: "Maria Santos",
    email: "maria@example.com",
    phone: "21965813894",
    description: "Uma rosa realista no ombro esquerdo.",
    placement: "Ombro esquerdo",
    size: "medium" as const,
    preferredDate: "2024-12-01",
  };

  it("should parse valid appointment data", () => {
    const result = appointmentSchema.safeParse(validAppointment);
    expect(result.success).toBe(true);
  });

  it("should fail for invalid size value", () => {
    const result = appointmentSchema.safeParse({ ...validAppointment, size: "huge" });
    expect(result.success).toBe(false);
  });

  it("should accept all valid sizes", () => {
    const sizes = ["small", "medium", "large", "extra-large"];
    sizes.forEach((size) => {
      const result = appointmentSchema.safeParse({ ...validAppointment, size });
      expect(result.success).toBe(true);
    });
  });

  it("should fail when description is too short", () => {
    const result = appointmentSchema.safeParse({ ...validAppointment, description: "Rosa" });
    expect(result.success).toBe(false);
  });

  it("should fail when preferredDate is empty", () => {
    const result = appointmentSchema.safeParse({ ...validAppointment, preferredDate: "" });
    expect(result.success).toBe(false);
  });

  it("should fail for missing fields", () => {
    const result = appointmentSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("galleryItemSchema", () => {
  const validItem = {
    title: "Rosa Realista",
    description: "Tatuagem realista de rosa no ombro",
    category: "Realismo",
    visible: true,
  };

  it("should parse valid gallery item", () => {
    const result = galleryItemSchema.safeParse(validItem);
    expect(result.success).toBe(true);
  });

  it("should fail when title is empty", () => {
    const result = galleryItemSchema.safeParse({ ...validItem, title: "" });
    expect(result.success).toBe(false);
  });

  it("should use default values for optional fields", () => {
    const result = galleryItemSchema.safeParse({ title: "Test", category: "Cat" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.visible).toBe(true);
      expect(result.data.description).toBe("");
    }
  });

  it("should fail when category is empty", () => {
    const result = galleryItemSchema.safeParse({ ...validItem, category: "" });
    expect(result.success).toBe(false);
  });
});

describe("settingsSchema", () => {
  const validSettings = {
    name: "Seven Tattoo",
    tagline: "Arte na pele",
    description: "Estúdio privado",
    address: "Rua Erne",
    phone: "+5521965813894",
    email: "contato@seven.com",
    instagram: "https://instagram.com/seventattoo_ofc",
    facebook: "https://facebook.com",
    whatsapp: "https://wa.me/5521965813894",
    tiktok: "https://tiktok.com/@7seventattoo",
    about: { title: "Sobre", content: "Nosso estúdio..." },
    businessHours: { "Segunda-Sexta": "10:00-20:00" },
  };

  it("should parse valid settings", () => {
    const result = settingsSchema.safeParse(validSettings);
    expect(result.success).toBe(true);
  });

  it("should fail when name is empty", () => {
    const result = settingsSchema.safeParse({ ...validSettings, name: "" });
    expect(result.success).toBe(false);
  });

  it("should allow empty email", () => {
    const result = settingsSchema.safeParse({ ...validSettings, email: "" });
    expect(result.success).toBe(true);
  });

  it("should fail for invalid email format", () => {
    const result = settingsSchema.safeParse({ ...validSettings, email: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

describe("messageReplySchema", () => {
  it("should parse valid reply", () => {
    const result = messageReplySchema.safeParse({ reply: "Olá, obrigado pelo contato!" });
    expect(result.success).toBe(true);
  });

  it("should fail for empty reply", () => {
    const result = messageReplySchema.safeParse({ reply: "" });
    expect(result.success).toBe(false);
  });

  it("should fail when reply is undefined", () => {
    const result = messageReplySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("appointmentStatusSchema", () => {
  it("should parse valid status", () => {
    const result = appointmentStatusSchema.safeParse({ status: "approved", notes: "OK" });
    expect(result.success).toBe(true);
  });

  it("should fail for invalid status", () => {
    const result = appointmentStatusSchema.safeParse({ status: "unknown", notes: "" });
    expect(result.success).toBe(false);
  });

  it("should accept all valid statuses", () => {
    const statuses = ["pending", "approved", "rejected", "completed"];
    statuses.forEach((status) => {
      const result = appointmentStatusSchema.safeParse({ status });
      expect(result.success).toBe(true);
    });
  });

  it("should default notes to empty string", () => {
    const result = appointmentStatusSchema.safeParse({ status: "pending" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.notes).toBe("");
    }
  });
});
