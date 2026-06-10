import { generateManyashaReply, type ChatTurn } from "@/lib/manyasha-chat-server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ChatRequest = {
  message?: string;
  history?: Array<{ role?: string; content?: string }>;
};

const MAX_MESSAGE_LEN = 800;
const MAX_HISTORY_ITEMS = 10;

export async function POST(request: Request) {
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ reply: "Некорректный запрос." }, { status: 400 });
  }

  const message = (body.message ?? "").trim().slice(0, MAX_MESSAGE_LEN);
  if (!message) {
    return NextResponse.json({ reply: "Напишите вопрос текстом." }, { status: 400 });
  }

  const history: ChatTurn[] = (body.history ?? []).slice(-MAX_HISTORY_ITEMS)
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: (m.content ?? "").trim(),
    }))
    .filter((m) => m.content);

  const result = await generateManyashaReply(message, history);
  return NextResponse.json(result);
}
