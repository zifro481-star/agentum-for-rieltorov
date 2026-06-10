import { NextResponse } from "next/server";
import { setAdminSession, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };

    if (!body.password || !verifyPassword(body.password)) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
    }

    await setAdminSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка входа" }, { status: 500 });
  }
}
