import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteLead, updateLeadStatus } from "@/lib/leads-store";
import type { LeadStatus } from "@/types/lead";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = (await request.json()) as { status: LeadStatus };
    const validStatuses: LeadStatus[] = ["new", "contacted", "approved", "rejected"];

    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Неверный статус" }, { status: 400 });
    }

    const lead = await updateLeadStatus(id, body.status);
    if (!lead) {
      return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch {
    return NextResponse.json({ error: "Ошибка обновления" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteLead(id);

  if (!deleted) {
    return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
