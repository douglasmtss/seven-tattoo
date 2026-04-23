import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGalleryItem, saveGalleryItem, deleteGalleryItem } from "@/lib/data";
import { galleryItemSchema } from "@/lib/validations";

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
    const item = getGalleryItem(id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Item não encontrado" }, { status: 404 });
    }

    const body = await req.json() as unknown;
    const result = galleryItemSchema.partial().safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Dados inválidos" }, { status: 400 });
    }

    const updated = { ...item, ...result.data };
    saveGalleryItem(updated);
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
  const deleted = deleteGalleryItem(id);
  if (!deleted) {
    return NextResponse.json({ success: false, error: "Item não encontrado" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
