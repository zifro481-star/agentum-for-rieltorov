import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { createLead, getAllLeads } from "@/lib/leads-store";
import type { CreateLeadInput } from "@/types/lead";

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
    const body = (await request.json()) as CreateLeadInput;

    if (!body.name?.trim() || !body.phone?.trim() || !body.city?.trim() || !body.profession?.trim()) {
      return NextResponse.json(
        { error: "Заполните обязательные поля" },
        { status: 400 },
      );
    }

    const lead = await createLead({
      name: body.name.trim(),
      phone: body.phone.trim(),
      telegram: body.telegram?.trim() ?? "",
      city: body.city.trim(),
      profession: body.profession.trim(),
    });

    return NextResponse.json(lead, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Не удалось сохранить заявку" },
      { status: 500 },
    );
  }
}
