import {
  CheckCircle2,
  Clock,
  Inbox,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";

type StatsCardsProps = {
  stats: {
    total: number;
    new: number;
    contacted: number;
    approved: number;
    rejected: number;
  };
};

const cards = [
  {
    key: "total",
    label: "Всего заявок",
    icon: Inbox,
    gradient: "from-blue-500 to-indigo-600",
    light: "from-blue-50 to-indigo-50",
  },
  {
    key: "new",
    label: "Новые",
    icon: Sparkles,
    gradient: "from-indigo-500 to-violet-600",
    light: "from-indigo-50 to-violet-50",
  },
  {
    key: "contacted",
    label: "Связались",
    icon: Clock,
    gradient: "from-amber-500 to-orange-600",
    light: "from-amber-50 to-orange-50",
  },
  {
    key: "approved",
    label: "Одобрены",
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-teal-600",
    light: "from-emerald-50 to-teal-50",
  },
  {
    key: "rejected",
    label: "Отклонены",
    icon: XCircle,
    gradient: "from-rose-500 to-red-600",
    light: "from-rose-50 to-red-50",
  },
] as const;

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <TrendingUp className="h-4 w-4 text-blue-600" />
        Сводка по заявкам
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.key}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${card.gradient}`}
            />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {stats[card.key]}
                </p>
              </div>
              <div
                className={`rounded-xl bg-gradient-to-br ${card.light} p-2.5 text-slate-700`}
              >
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
