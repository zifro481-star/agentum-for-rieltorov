"use client";

import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";

const screenshots = [
  {
    src: "/images/app/Главная.jpeg",
    title: "Главная",
    description: "Доход, лиды и ключевые показатели на одном экране.",
  },
  {
    src: "/images/app/Передать доверителя.jpeg",
    title: "Передача лида",
    description: "Передайте клиента за пару минут прямо из приложения.",
  },
  {
    src: "/images/app/Финансы.jpeg",
    title: "Финансы",
    description: "Выплаты, ожидаемый доход и история начислений.",
  },
  {
    src: "/images/app/Профиль.jpeg",
    title: "Профиль",
    description: "Контакты, настройки и данные партнёра в одном месте.",
  },
];

type Screenshot = (typeof screenshots)[number];

export function AppScreenshots() {
  const [activeShot, setActiveShot] = useState<Screenshot | null>(null);

  useEffect(() => {
    if (!activeShot) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveShot(null);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeShot]);

  return (
    <>
      <Section id="app" className="overflow-hidden bg-slate-50/60">
        <SectionHeader
          badge="Приложение"
          title="Мобильное приложение для партнёров"
          description="Передавайте клиентов, следите за статусами и общайтесь с менеджером — всё в телефоне."
        />

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {screenshots.map((shot) => (
            <figure key={shot.title} className="group flex flex-col items-center">
              <button
                type="button"
                onClick={() => setActiveShot(shot)}
                aria-label={`Открыть скриншот: ${shot.title}`}
                className="relative w-full max-w-[280px] cursor-zoom-in rounded-[2rem] border border-slate-200/80 bg-slate-900 p-2 text-left shadow-xl shadow-slate-300/40 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-200/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:max-w-[300px] lg:max-w-[280px] xl:max-w-[300px]"
              >
                <div className="overflow-hidden rounded-[1.5rem] bg-black">
                  <Image
                    src={shot.src}
                    alt={shot.title}
                    width={390}
                    height={844}
                    className="h-auto w-full object-cover object-top"
                    sizes="(min-width: 1280px) 300px, (min-width: 640px) 300px, 280px"
                  />
                </div>
                <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100 sm:opacity-0">
                  <ZoomIn className="h-4 w-4" />
                </span>
              </button>
              <figcaption className="mt-5 text-center">
                <h3 className="font-semibold text-slate-900">{shot.title}</h3>
                <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-slate-600">
                  {shot.description}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {activeShot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-3 backdrop-blur-sm sm:p-5"
          onClick={() => setActiveShot(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeShot.title}
        >
          <button
            type="button"
            onClick={() => setActiveShot(null)}
            aria-label="Закрыть"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-8 sm:top-8"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative flex max-h-[93vh] w-full max-w-[min(86vw,500px)] flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black p-1 shadow-2xl">
              <Image
                src={activeShot.src}
                alt={activeShot.title}
                width={390}
                height={844}
                className="max-h-[calc(93vh-3rem)] w-full object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <p className="mt-2 text-center text-sm font-medium text-white">
              {activeShot.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
