import { generateManyashaReply, type ChatTurn } from "@/lib/manyasha-chat-server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ChatRequest = {
  message?: string;
  history?: Array<{ role?: string; content?: string }>;
};

export async function POST(request: Request) {
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ reply: "Некорректный запрос." }, { status: 400 });
  }

  const history: ChatTurn[] = (body.history ?? [])
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: (m.content ?? "").trim(),
    }))
    .filter((m) => m.content);

  const result = await generateManyashaReply(body.message ?? "", history);
  return NextResponse.json(result);
}
