import { readFileSync } from "node:fs";
import { join } from "node:path";

export type ChatTurn = { role: "user" | "assistant"; content: string };

const MAX_HISTORY_TURNS = 10;
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite";
const LLM_TIMEOUT_MS = Number(process.env.MANYASHA_LLM_TIMEOUT_SECONDS ?? "12") * 1000;
const IS_DEV = process.env.NODE_ENV === "development";

let cachedPrompt: string | null = null;

function getSystemPrompt(): string {
  if (cachedPrompt) return cachedPrompt;
  const promptPath =
    process.env.MANYASHA_PROMPT_FILE ??
    join(process.cwd(), "prompts", "manyasha-prompt.txt");
  try {
    cachedPrompt = readFileSync(promptPath, "utf-8").trim();
  } catch {
    cachedPrompt =
      "Ты — Маняша, консультант партнёрской программы Agentum Pro для риелторов. " +
      "Отвечай по-русски, кратко и по делу на «вы».";
  }
  return cachedPrompt;
}

function cleanReply(text: string): string {
  return text
    .replace(/\[\[[^\]]*\]\]/g, "")
    .replace(/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]+/g, "")
    .trim();
}

export function localFallbackReply(userMessage: string): string {
  const q = userMessage.toLowerCase();

  if (
    /(как|где)\s*.{0,25}(передать|переда|отправ)/.test(q) ||
    q.includes("передача лида") ||
    q.includes("передать клиент")
  ) {
    return (
      "Передать лид можно так:\n" +
      "1) На лендинге — через форму заявки.\n" +
      "2) В веб-кабинете на agentum.pro — раздел передачи лидов, за пару минут из браузера.\n" +
      "3) В мобильном приложении — экран «Передача лида».\n" +
      "После передачи статус лида появится в кабинете, а специалист Agentum свяжется с клиентом в течение рабочего дня."
    );
  }

  if (q.includes("статус") || q.includes("этап") || q.includes("отслеж")) {
    return (
      "Статусы по каждому переданному клиенту видны в личном кабинете партнёра в реальном времени: " +
      "от передачи лида до договора и выплаты. В приложении — на главном экране и в карточке лида. " +
      "Также приходят уведомления при смене статуса."
    );
  }

  if (q.includes("финанс") || q.includes("выплат") || q.includes("доход")) {
    return (
      "Раздел «Финансы» есть в веб-кабинете и в мобильном приложении: история выплат, ожидаемый доход " +
      "и начисления по каждому лиду. Вознаграждение начисляется после подписания договора клиентом с Agentum Pro. " +
      "Ориентиры: от 30 000 ₽ (простой кейс) до 150 000 ₽ (сложный)."
    );
  }

  if (q.includes("приложен") || q.includes("мобил") || q.includes("телефон")) {
    return (
      "Мобильное приложение для партнёров: главная (доход и лиды), передача лида, финансы и профиль. " +
      "Удобно передавать клиентов и следить за статусами с телефона. " +
      "Веб-кабинет на agentum.pro — те же функции без установки приложения."
    );
  }

  if (q.includes("реферал") || q.includes("qr") || q.includes("приглас")) {
    return (
      "В разделе «Профиль» веб-кабинета — ваши данные, реферальная ссылка и QR-код для приглашения новых партнёров в сеть Agentum Pro."
    );
  }

  if (q.includes("материал") || q.includes("шаблон") || q.includes("презентац")) {
    return (
      "В платформе есть раздел «Материалы»: шаблоны, презентации и документы для работы с клиентами. " +
      "Также доступны обучение и вебинары по сложным кейсам."
    );
  }

  if (q.includes("вход") || q.includes("зарегистр") || q.includes("аккаунт") || q.includes("логин")) {
    return (
      "Стать партнёром можно через форму на лендинге — после регистрации откроется личный кабинет на agentum.pro. " +
      "Если нужна помощь с доступом — позвоните +7 (800) 555-10-10."
    );
  }

  if (anyWord(q, ["заработ", "вознаграж", "сколько", "оплат"])) {
    return (
      "Вознаграждение риелтора начисляется после подписания договора клиентом с Agentum Pro. " +
      "Ориентиры: простая рекомендация — от 30 000 ₽; стандартный кейс — 40 000–50 000 ₽; " +
      "сложный (налоги, крупные долги, оспаривание сделок) — до 150 000 ₽. " +
      "Точную сумму подскажем после оценки кейса. Телефон: +7 (800) 555-10-10."
    );
  }

  if (anyWord(q, ["банкрот", "долг", "пристав", "арест", "ипотек", "спис"])) {
    return (
      "По банкротству физлиц в РФ есть судебная процедура через арбитражный суд и " +
      "внесудебная через МФЦ (при долге 25 000–1 000 000 ₽ и отсутствии имущества для взыскания). " +
      "Списываются кредиты, займы, часть налогов; не списываются алименты и вред жизни/здоровью. " +
      "Детали зависят от ситуации — передайте клиента в Agentum Pro, мы разберём кейс. +7 (800) 555-10-10."
    );
  }

  if (
    anyWord(q, [
      "платформ",
      "кабинет",
      "личн",
      "раздел",
      "экран",
      "главн",
      "профил",
      "обучен",
      "уведомлен",
      "поддержк",
      "менеджер",
    ])
  ) {
    return (
      "Платформа Agentum Pro для партнёров — веб-кабинет на agentum.pro и мобильное приложение.\n" +
      "В кабинете: передача лидов, статусы клиентов, финансы, профиль с реферальной ссылкой и QR, " +
      "материалы, обучение, поддержка и уведомления.\n" +
      "Спросите конкретнее — например: «как передать лид», «где финансы» или «что в приложении»."
    );
  }

  if (anyWord(q, ["партнёр", "риелтор", "переда", "лид", "сотруднич"])) {
    return (
      "Партнёрская программа Agentum Pro для риелторов: вы передаёте клиента с проблемной " +
      "недвижимостью или долгами — юридическую работу берём на себя, статусы видны в личном кабинете, " +
      "вознаграждение — после договора с клиентом. Стать партнёром можно на лендинге или по телефону " +
      "+7 (800) 555-10-10."
    );
  }

  return (
    "Я Маняша, консультант Agentum Pro. Могу рассказать про партнёрскую программу, личный кабинет, " +
    "мобильное приложение, вознаграждение и банкротство. " +
    "Спросите, например: «как передать лид», «где смотреть выплаты» или «сколько можно заработать». " +
    "Телефон: +7 (800) 555-10-10."
  );
}

function anyWord(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w));
}

async function geminiComplete(messages: ChatTurn[]): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const systemPrompt = getSystemPrompt();
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const payload = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: { temperature: 0.5, maxOutputTokens: 700 },
  };

  const models = [GEMINI_MODEL, "gemini-2.5-flash-lite", "gemini-2.0-flash"];
  const seen = new Set<string>();

  for (const model of models) {
    if (!model || seen.has(model)) continue;
    seen.add(model);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        },
      );

      if (!res.ok) {
        if (IS_DEV) {
          const errBody = await res.text().catch(() => "");
          console.warn(`[manyasha] Gemini ${model} HTTP ${res.status}:`, errBody.slice(0, 300));
        }
        continue;
      }

      const data = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = (data.candidates?.[0]?.content?.parts ?? [])
        .map((p) => p.text ?? "")
        .join("")
        .trim();
      if (text) return cleanReply(text);
    } catch {
      continue;
    } finally {
      clearTimeout(timer);
    }
  }

  return null;
}

export async function generateManyashaReply(
  message: string,
  history: ChatTurn[],
): Promise<{ reply: string; source: string }> {
  const userMessage = message.trim();
  if (!userMessage) {
    return { reply: "Напишите, пожалуйста, ваш вопрос.", source: "empty" };
  }

  const provider = (process.env.MANYASHA_LLM_PROVIDER ?? "auto").toLowerCase();
  const skipLlm = provider === "none" || provider === "fallback";
  const useLlm =
    !skipLlm &&
    (provider === "gemini" ||
      (provider === "auto" && Boolean(process.env.GEMINI_API_KEY?.trim())));

  const turns = history
    .filter((m) => m.content.trim())
    .slice(-MAX_HISTORY_TURNS)
    .map((m) => ({ role: m.role, content: m.content.trim() }) as ChatTurn);

  if (useLlm) {
    const llmReply = await geminiComplete([...turns, { role: "user", content: userMessage }]);
    if (llmReply) {
      return { reply: llmReply, source: "gemini" };
    }
    if (IS_DEV) {
      console.warn("[manyasha] Gemini unavailable, using local fallback");
    }
  }

  return { reply: localFallbackReply(userMessage), source: "fallback" };
}
