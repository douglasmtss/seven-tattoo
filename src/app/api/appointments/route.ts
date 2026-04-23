import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAppointments, saveAppointment } from "@/lib/data";
import { appointmentSchema } from "@/lib/validations";
import { generateId } from "@/lib/utils";
import { Appointment } from "@/types";
import { saveAnalyticsEvent } from "@/lib/data";

const RATE_LIMIT_MAP = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

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

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: getAppointments() });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Muitas tentativas. Tente mais tarde." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json() as unknown;
    const result = appointmentSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Dados inválidos", details: result.error.flatten() }, { status: 400 });
    }

    const appointment: Appointment = {
      id: generateId(),
      ...result.data,
      status: "pending",
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveAppointment(appointment);
    saveAnalyticsEvent({
      id: generateId(),
      type: "appointment_request",
      page: "/",
      referrer: req.headers.get("referer") || "",
      userAgent: req.headers.get("user-agent") || "",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
