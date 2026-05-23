"use client";

import {
  Briefcase,
  Calendar,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Lead, LeadStatus } from "@/types/lead";
import { LEAD_STATUS_LABELS, LEAD_STATUS_STYLES } from "@/types/lead";
import { cn } from "@/lib/utils";

type LeadsPanelProps = {
  initialLeads: Lead[];
};

const statusFilters: Array<{ value: LeadStatus | "all"; label: string }> = [
  { value: "all", label: "Все" },
  { value: "new", label: "Новые" },
  { value: "contacted", label: "Связались" },
  { value: "approved", label: "Одобрены" },
  { value: "rejected", label: "Отклонены" },
];

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function LeadsPanel({ initialLeads }: LeadsPanelProps) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesFilter = filter === "all" || lead.status === filter;
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.phone.includes(query) ||
        lead.city.toLowerCase().includes(query) ||
        lead.profession.toLowerCase().includes(query) ||
        lead.telegram.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [leads, filter, search]);

  const updateStatus = async (id: string, status: LeadStatus) => {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        const updated = (await response.json()) as Lead;
        setLeads((prev) => prev.map((l) => (l.id === id ? updated : l)));
        router.refresh();
      }
    } finally {
      setLoadingId(null);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Удалить эту заявку?")) return;

    setLoadingId(id);
    try {
      const response = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (response.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        router.refresh();
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени, телефону, городу..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                  filter === item.value
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-white",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-lg font-semibold text-slate-900">Заявок пока нет</p>
          <p className="mt-2 text-sm text-slate-500">
            Новые заявки с формы на сайте появятся здесь автоматически.
          </p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="font-medium text-slate-900">Ничего не найдено</p>
          <p className="mt-1 text-sm text-slate-500">
            Попробуйте изменить фильтр или поисковый запрос.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredLeads.map((lead) => (
            <article
              key={lead.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-blue-100 hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-600/20">
                    {getInitials(lead.name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {lead.name}
                      </h3>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
                          LEAD_STATUS_STYLES[lead.status],
                        )}
                      >
                        {LEAD_STATUS_LABELS[lead.status]}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="h-4 w-4 shrink-0 text-blue-600" />
                        <a
                          href={`tel:${lead.phone}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {lead.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 shrink-0 text-indigo-600" />
                        {lead.city}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Briefcase className="h-4 w-4 shrink-0 text-violet-600" />
                        {lead.profession}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="font-medium text-slate-400">TG:</span>
                        {lead.telegram || "не указан"}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(lead.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 lg:flex-col lg:items-stretch xl:flex-row">
                  <select
                    value={lead.status}
                    disabled={loadingId === lead.id}
                    onChange={(e) =>
                      updateStatus(lead.id, e.target.value as LeadStatus)
                    }
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                  >
                    {(Object.keys(LEAD_STATUS_LABELS) as LeadStatus[]).map(
                      (status) => (
                        <option key={status} value={status}>
                          {LEAD_STATUS_LABELS[status]}
                        </option>
                      ),
                    )}
                  </select>

                  <button
                    type="button"
                    disabled={loadingId === lead.id}
                    onClick={() => deleteLead(lead.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    {loadingId === lead.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Удалить
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
