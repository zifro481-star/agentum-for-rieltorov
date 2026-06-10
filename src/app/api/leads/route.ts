import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createLead, getAllLeads } from "@/lib/leads-store";
import { isHoneypotFilled, isValidPhone, sanitizeText } from "@/lib/security/validate";
import type { CreateLeadInput } from "@/types/lead";

type LeadPayload = CreateLeadInput & { website?: string };

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await getAllLeads();
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadPayload;

    if (isHoneypotFilled(body.website)) {
      return NextResponse.json({ id: "ok" }, { status: 201 });
    }

    const name = sanitizeText(body.name ?? "", 120);
    const phone = sanitizeText(body.phone ?? "", 32);
    const city = sanitizeText(body.city ?? "", 80);
    const profession = sanitizeText(body.profession ?? "", 80);
    const telegram = sanitizeText(body.telegram ?? "", 64);

    if (!name || !phone || !city || !profession) {
      return NextResponse.json(
        { error: "Заполните обязательные поля" },
        { status: 400 },
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { error: "Укажите корректный номер телефона" },
        { status: 400 },
      );
    }

    const lead = await createLead({
      name,
      phone,
      telegram,
      city,
      profession,
    });

    return NextResponse.json(lead, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Не удалось сохранить заявку" },
      { status: 500 },
    );
  }
}
