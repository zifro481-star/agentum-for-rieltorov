import { localFallbackReply } from "@/lib/manyasha-chat-server";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const promptPath =
    process.env.MANYASHA_PROMPT_FILE ?? join(process.cwd(), "prompts", "manyasha-prompt.txt");

  return NextResponse.json({
    status: "ok",
    chatApi: "/api/manyasha/chat",
    provider: process.env.MANYASHA_LLM_PROVIDER ?? "auto",
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
    promptFileExists: existsSync(promptPath),
    fallbackOk: Boolean(localFallbackReply("платформа")?.trim()),
  });
}
