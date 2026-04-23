import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAppointment, saveAppointment, deleteAppointment } from "@/lib/data";
import { appointmentStatusSchema } from "@/lib/validations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const appt = getAppointment(id);
    if (!appt) {
      return NextResponse.json({ success: false, error: "Agendamento não encontrado" }, { status: 404 });
    }

    const body = await req.json() as unknown;
    const result = appointmentStatusSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Dados inválidos" }, { status: 400 });
    }

    const updated = {
      ...appt,
      status: result.data.status,
      notes: result.data.notes,
      updatedAt: new Date().toISOString(),
    };
    saveAppointment(updated);
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = deleteAppointment(id);
  if (!deleted) {
    return NextResponse.json({ success: false, error: "Agendamento não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
