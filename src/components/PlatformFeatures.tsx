import {
  Bell,
  BookOpen,
  Headphones,
  LayoutDashboard,
  Receipt,
  Send,
  Signal,
  Wallet,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

const features = [
  {
    icon: LayoutDashboard,
    title: "Личный кабинет",
    description: "Управляйте партнёрством и отслеживайте все переданные лиды.",
  },
  {
    icon: Send,
    title: "Передача лидов онлайн",
    description: "Передавайте клиентов за пару минут прямо из браузера.",
  },
  {
    icon: Signal,
    title: "Статусы",
    description: "Прозрачное отслеживание этапов работы с каждым клиентом.",
  },
  {
    icon: Wallet,
    title: "Финансы",
    description: "История выплат и прогноз вознаграждения по каждому лиду.",
  },
  {
    icon: Receipt,
    title: "Материалы",
    description: "Шаблоны, презентации и документы для работы с клиентами.",
  },
  {
    icon: BookOpen,
    title: "Обучение",
    description: "Курсы и вебинары по работе со сложными кейсами.",
  },
  {
    icon: Headphones,
    title: "Поддержка",
    description: "Персональный менеджер и оперативная помощь партнёрам.",
  },
  {
    icon: Bell,
    title: "Уведомления",
    description: "Мгновенные оповещения о смене статуса и начислении вознаграждения.",
  },
];

export function PlatformFeatures() {
  return (
    <Section id="platform">
      <SectionHeader
        badge="Платформа"
        title="Всё для работы партнёра"
        description="Инструменты, которые помогают передавать клиентов и контролировать результат."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-blue-100 hover:shadow-md"
          >
            <div className="mb-3 inline-flex rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-2.5">
              <feature.icon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
