import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGallery, saveGalleryItem } from "@/lib/data";
import { galleryItemSchema } from "@/lib/validations";
import { generateId } from "@/lib/utils";
import { GalleryItem } from "@/types";

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }
  const gallery = getGallery();
  return NextResponse.json({ success: true, data: gallery });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const visible = formData.get("visible") !== "false";
    const file = formData.get("image") as File | null;

    const result = galleryItemSchema.safeParse({ title, description, category, visible });
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Dados inválidos" }, { status: 400 });
    }

    let imageUrl = "/icons/icon-192x192.png";

    if (file && file.size > 0) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ success: false, error: "Tipo de arquivo inválido" }, { status: 400 });
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: "Arquivo muito grande (max 10MB)" }, { status: 400 });
      }

      const { writeFile, mkdir } = await import("fs/promises");
      const path = await import("path");
      const uploadDir = path.join(process.cwd(), "public", "uploads", "gallery");
      await mkdir(uploadDir, { recursive: true });

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
      const filename = `${generateId()}.${safeExt}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadDir, filename), buffer);
      imageUrl = `/uploads/gallery/${filename}`;
    }

    const item: GalleryItem = {
      id: generateId(),
      title: result.data.title,
      description: result.data.description,
      category: result.data.category,
      visible: result.data.visible,
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    saveGalleryItem(item);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
