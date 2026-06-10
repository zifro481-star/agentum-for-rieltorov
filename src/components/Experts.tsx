import Image from "next/image";
import { Briefcase, Scale } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

const experts = [
  {
    name: "Андрей Абукаев",
    role: "Арбитражный управляющий",
    photo: "/images/experts/abukaev.jpg",
    experience: "9 лет опыта",
    cases: "1 200+ дел",
  },
  {
    name: "Василий Артин",
    role: "Арбитражный управляющий",
    photo: "/images/experts/artin.jpg",
    experience: "12 лет опыта",
    cases: "1 800+ дел",
  },
  {
    name: "Александр Герасимов",
    role: "Арбитражный управляющий",
    photo: "/images/experts/gerasimov.jpg",
    experience: "8 лет опыта",
    cases: "950+ дел",
  },
];

export function Experts() {
  return (
    <Section id="experts" className="bg-white">
      <SectionHeader
        badge="Команда"
        title="Эксперты, которые ведут ваши кейсы"
        description="С клиентами работают практикующие юристы с многолетним опытом в банкротстве и защите имущества."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {experts.map((expert) => (
          <article
            key={expert.name}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/40"
          >
            <div className="relative h-72 w-full overflow-hidden bg-slate-100">
              <Image
                src={expert.photo}
                alt={expert.name}
                fill
                className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {expert.name}
              </h3>
              <p className="mt-1 text-sm leading-snug text-slate-600">
                {expert.role}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-blue-50 px-4 py-3">
                  <div className="mb-1 flex items-center gap-1.5 text-blue-600">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-wide">
                      Стаж
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {expert.experience}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 px-4 py-3">
                  <div className="mb-1 flex items-center gap-1.5 text-blue-600">
                    <Scale className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-wide">
                      Дел
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {expert.cases}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
