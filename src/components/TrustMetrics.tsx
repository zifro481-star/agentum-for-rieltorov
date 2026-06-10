import { Award, Briefcase, Handshake, MapPin, Users } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

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
    icon: Handshake,
    value: "800+",
    label: "партнёров доверяют нам",
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
    compactValue: true,
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

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                <metric.icon className="h-6 w-6 text-blue-400" />
              </div>

              <div className="flex h-14 items-center justify-center sm:h-16">
                <p
                  className={cn(
                    "font-bold leading-none text-white",
                    metric.compactValue
                      ? "whitespace-nowrap text-xl sm:text-2xl xl:text-[1.75rem]"
                      : "text-3xl sm:text-4xl",
                  )}
                >
                  {metric.value}
                </p>
              </div>

              <p className="mt-2 min-h-[2.75rem] max-w-[11rem] text-sm leading-snug text-slate-400">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
