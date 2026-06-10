import {
  AlertTriangle,
  CreditCard,
  Home,
  Plane,
  Shield,
  Wallet,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

const cards = [
  {
    icon: AlertTriangle,
    title: "Недвижимость под арестом",
    description: "Приставы, долги, ограничения на распоряжение объектом.",
    accent: "from-red-50 to-orange-50",
    iconColor: "text-red-600",
  },
  {
    icon: CreditCard,
    title: "Ипотека и просрочки",
    description: "Риск потери объекта из-за накопившихся платежей.",
    accent: "from-amber-50 to-yellow-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Home,
    title: "Продажа невозможна из-за долгов",
    description: "Сделка блокируется обременениями и финансовыми проблемами.",
    accent: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
  },
  {
    icon: Shield,
    title: "Клиенту нужна защита имущества",
    description: "Требуется законная стратегия сохранения недвижимости.",
    accent: "from-emerald-50 to-teal-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: Plane,
    title: "Запрет выезда за границу",
    description: "Ограничения из-за долгов перед ФССП и судами.",
    accent: "from-violet-50 to-purple-50",
    iconColor: "text-violet-600",
  },
  {
    icon: Wallet,
    title: "Блокировка карт и счетов",
    description: "Арест счетов, списания и блокировка доступа к средствам.",
    accent: "from-rose-50 to-pink-50",
    iconColor: "text-rose-600",
  },
];

export function TargetAudience() {
  return (
    <Section id="clients" className="bg-slate-50/60">
      <SectionHeader
        badge="Целевая аудитория"
        title="Какие клиенты подходят"
        description="Передавайте сложные кейсы в работу лучшим юристам в сфере банкротства — мы возьмём на себя юридическую работу, а вы получите гарантированно вознаграждение."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {cards.map((card) => (
          <article
            key={card.title}
            className="group rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${card.accent} p-3`}
            >
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
