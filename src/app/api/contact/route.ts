import { NextRequest, NextResponse } from "next/server";
import { saveMessage } from "@/lib/data";
import { saveAnalyticsEvent } from "@/lib/data";
import { contactSchema } from "@/lib/validations";
import { generateId } from "@/lib/utils";
import { ContactMessage } from "@/types";

const RATE_LIMIT_MAP = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = RATE_LIMIT_MAP.get(ip);

  if (!record || now > record.reset) {
    RATE_LIMIT_MAP.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) return false;

  record.count++;
  return true;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Muitas tentativas. Tente novamente mais tarde." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json() as unknown;
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = result.data;

    const newMessage: ContactMessage = {
      id: generateId(),
      name,
      email,
      phone,
      message,
      createdAt: new Date().toISOString(),
      read: false,
      replied: false,
    };

    saveMessage(newMessage);

    saveAnalyticsEvent({
      id: generateId(),
      type: "contact_form",
      page: "/",
      referrer: req.headers.get("referer") || "",
      userAgent: req.headers.get("user-agent") || "",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Mensagem enviada!" });
  } catch {
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
