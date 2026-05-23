import { Award, Briefcase, MapPin, Users } from "lucide-react";
import { Section } from "@/components/ui/Section";

const metrics = [
  {
    icon: Briefcase,
    value: "17 000+",
    label: "процедур проведено",
  },
  {
    icon: Award,
    value: "11 лет",
    label: "опыта на рынке",
  },
  {
    icon: Users,
    value: "80+",
    label: "специалистов в команде",
  },
  {
    icon: MapPin,
    value: "По всей РФ",
    label: "работаем удалённо и очно",
  },
];

export function TrustMetrics() {
  return (
    <Section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      <div className="relative">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-300">
            Нам доверяют
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Цифры, которые говорят сами за себя
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="mx-auto mb-4 inline-flex rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                <metric.icon className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white sm:text-4xl">
                {metric.value}
              </p>
              <p className="mt-2 text-sm text-slate-400">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
