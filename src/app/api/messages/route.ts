import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMessages } from "@/lib/data";

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }
  const messages = getMessages();
  return NextResponse.json({ success: true, data: messages });
}
