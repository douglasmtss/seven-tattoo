import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/data";
import { settingsSchema } from "@/lib/validations";

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: getSettings() });
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json() as unknown;
    const result = settingsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Dados inválidos", details: result.error.flatten() }, { status: 400 });
    }
    saveSettings(result.data as Parameters<typeof saveSettings>[0]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
