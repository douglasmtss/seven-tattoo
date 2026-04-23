import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMessage, saveMessage, deleteMessage } from "@/lib/data";
import { messageReplySchema } from "@/lib/validations";

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
    const msg = getMessage(id);
    if (!msg) {
      return NextResponse.json({ success: false, error: "Mensagem não encontrada" }, { status: 404 });
    }

    const body = await req.json() as { read?: boolean; reply?: string };

    if (typeof body.read === "boolean") {
      saveMessage({ ...msg, read: body.read });
      return NextResponse.json({ success: true });
    }

    if (typeof body.reply === "string") {
      const result = messageReplySchema.safeParse({ reply: body.reply });
      if (!result.success) {
        return NextResponse.json({ success: false, error: "Resposta inválida" }, { status: 400 });
      }
      saveMessage({
        ...msg,
        reply: result.data.reply,
        replied: true,
        repliedAt: new Date().toISOString(),
        read: true,
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Nenhuma ação especificada" }, { status: 400 });
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
  const deleted = deleteMessage(id);
  if (!deleted) {
    return NextResponse.json({ success: false, error: "Mensagem não encontrada" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
