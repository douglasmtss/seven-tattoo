import { NextRequest, NextResponse } from "next/server";
import { saveAnalyticsEvent } from "@/lib/data";
import { generateId } from "@/lib/utils";
import { AnalyticsEvent } from "@/types";

const VALID_TYPES: AnalyticsEvent["type"][] = [
  "pageview",
  "contact_form",
  "gallery_view",
  "appointment_request",
  "whatsapp_click",
];

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as { type?: string; page?: string };

    if (!body.type || !VALID_TYPES.includes(body.type as AnalyticsEvent["type"])) {
      return NextResponse.json({ success: false, error: "Tipo inválido" }, { status: 400 });
    }

    saveAnalyticsEvent({
      id: generateId(),
      type: body.type as AnalyticsEvent["type"],
      page: typeof body.page === "string" ? body.page.slice(0, 200) : "/",
      referrer: req.headers.get("referer") || "",
      userAgent: req.headers.get("user-agent") || "",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
