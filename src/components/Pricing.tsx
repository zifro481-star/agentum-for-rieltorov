import { Sparkles, Star, Zap } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

const tiers = [
  {
    icon: Zap,
    title: "Простая рекомендация",
    amount: "от 30 000 ₽",
    description: "Клиент с понятной ситуацией, минимальная юридическая подготовка.",
    highlight: false,
  },
  {
    icon: Star,
    title: "Стандартная процедура",
    amount: "40 000 - 50 000 ₽",
    description: "Типовой кейс с долгами, арестами или ипотечными просрочками.",
    highlight: true,
  },
  {
    icon: Sparkles,
    title: "Нестандартная процедура",
    amount: "до 150 000 ₽",
    description:
      "Процедура с претензией налоговой, с большой суммой долгов, оспариванием сделок.",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <Section id="pricing" className="bg-slate-50/60">
      <SectionHeader
        badge="Доход"
        title="Как зарабатывают наши партнеры"
        description="Размер вознаграждения зависит от сложности кейса и суммы договора с клиентом."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <article
            key={tier.title}
            className={`relative flex flex-col rounded-xl border p-6 transition-shadow ${
              tier.highlight
                ? "border-blue-200 bg-gradient-to-b from-blue-50/80 to-white shadow-md shadow-blue-100/50"
                : "border-slate-200/80 bg-white shadow-sm hover:shadow-md"
            }`}
          >
            {tier.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
                Популярный
              </span>
            )}

            <div
              className={`mb-4 inline-flex w-fit rounded-xl p-3 ${
                tier.highlight
                  ? "bg-blue-100"
                  : "bg-slate-100"
              }`}
            >
              <tier.icon
                className={`h-6 w-6 ${
                  tier.highlight ? "text-blue-600" : "text-slate-600"
                }`}
              />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">{tier.title}</h3>
            <p className="mt-2 text-2xl font-bold text-slate-900">{tier.amount}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
              {tier.description}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-8 text-center text-xs leading-relaxed text-slate-500">
        * Размер вознаграждения зависит от суммы договора, заключённого клиентом
        с Agentum Pro. Точная сумма отображается в личном кабинете после оценки
        кейса.
      </p>
    </Section>
  );
}
