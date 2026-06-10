import {
  ArrowRight,
  ArrowRightLeft,
  FileCheck,
  HeartHandshake,
  Phone,
  Send,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  light: string;
  iconWrapClass?: string;
  badgeClass?: string;
  lineClass?: string;
};

const steps: Step[] = [
  {
    icon: Send,
    title: "Передаёте клиента",
    description: "Заполните форму или передайте лид через личный кабинет.",
    accent: "from-blue-500 to-blue-600",
    light: "bg-blue-50 text-blue-600",
  },
  {
    icon: Phone,
    title: "Agentum связывается",
    description: "Наш специалист свяжется с клиентом в течение рабочего дня.",
    accent: "from-blue-500 to-blue-600",
    light: "bg-blue-50 text-blue-600",
  },
  {
    icon: FileCheck,
    title: "Клиент заключает договор",
    description: "Мы предложим законное решение и оформим сотрудничество.",
    accent: "from-blue-500 to-blue-600",
    light: "bg-blue-50 text-blue-600",
  },
  {
    icon: Wallet,
    title: "Получаете вознаграждение",
    description: "Выплата после подписания договора с клиентом.",
    accent: "from-emerald-600 to-emerald-700",
    light: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: ArrowRightLeft,
    title: "Отслеживаете статус",
    description: "Все этапы видны в личном кабинете партнёра в реальном времени.",
    accent: "from-blue-500 to-blue-600",
    light: "bg-blue-50 text-blue-600",
  },
  {
    icon: HeartHandshake,
    title: "Благодарность клиента",
    description: "Клиент благодарит вас за помощь и рекомендует вас дальше.",
    accent: "from-blue-500 to-blue-600",
    light: "bg-blue-50 text-blue-600",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="overflow-hidden bg-slate-50/70">
      <SectionHeader
        badge="Процесс"
        title="Как работает наша платформа"
        description="Шесть простых шагов от передачи клиента до его благодарности."
      />

      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent lg:block" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-100/40 sm:p-6"
            >
              {index < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 xl:block">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-slate-100">
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
              )}

              <div className="mb-4 flex items-center justify-between">
                <span
                  className={
                    step.iconWrapClass ??
                    `inline-flex rounded-xl p-2.5 ${step.light} transition-transform group-hover:scale-110`
                  }
                >
                  <step.icon className="h-5 w-5" />
                </span>
                <span
                  className={
                    step.badgeClass ??
                    `flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${step.accent} text-xs font-bold text-white shadow-sm`
                  }
                >
                  {index + 1}
                </span>
              </div>

              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Шаг {index + 1}
              </p>
              <h3 className="mt-1 text-base font-semibold leading-snug text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>

              <div
                className={
                  step.lineClass ??
                  `mt-4 h-1 w-full rounded-full bg-gradient-to-r ${step.accent} opacity-20 transition-opacity group-hover:opacity-40`
                }
              />
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 text-center">
          <p className="text-sm font-medium text-slate-700">
            От заявки до выплаты —{" "}
            <span className="text-blue-600">прозрачно на каждом этапе</span>
          </p>
        </div>
      </div>
    </Section>
  );
}
