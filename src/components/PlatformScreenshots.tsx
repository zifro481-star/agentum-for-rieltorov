"use client";

import Image from "next/image";
import { X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";

const screenshots = [
  {
    src: "/images/platform/o-platforme.png",
    title: "О платформе",
    description: "Обзор партнёрской сети, выплат и ключевых показателей в одном окне.",
  },
  {
    src: "/images/platform/профиль.png",
    title: "Профиль",
    description: "Персональные данные, реферальная ссылка и QR-код для регистрации партнёров.",
  },
  {
    src: "/images/platform/финансы.png",
    title: "Финансы",
    description: "Выплаты, ожидаемый доход и история начислений партнёра.",
  },
];

type Screenshot = (typeof screenshots)[number];

function BrowserFrame({
  shot,
  onOpen,
}: {
  shot: Screenshot;
  onOpen: () => void;
}) {
  return (
    <figure className="group flex flex-col">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Открыть скриншот: ${shot.title}`}
        className="relative w-full cursor-zoom-in overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 text-left shadow-lg shadow-slate-300/40 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-200/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-3 truncate text-xs text-slate-400">
            agentum.pro
          </span>
        </div>

        <div className="overflow-hidden bg-slate-950">
          <Image
            src={shot.src}
            alt={shot.title}
            width={1024}
            height={590}
            className="h-auto w-full object-cover object-top"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        </div>

        <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-opacity group-hover:opacity-100 sm:opacity-0">
          <ZoomIn className="h-4 w-4" />
        </span>
      </button>

      <figcaption className="mt-5">
        <h3 className="font-semibold text-slate-900">{shot.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
          {shot.description}
        </p>
      </figcaption>
    </figure>
  );
}

export function PlatformScreenshots() {
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
      <Section id="platform-screenshots" className="bg-white">
        <SectionHeader
          badge="Платформа"
          title="Личный кабинет партнёра на основном сайте"
          description="Управляйте лидами, финансами и коммуникацией в веб-версии Agentum Pro — без установки приложения."
          className="lg:!max-w-5xl lg:[&>p]:whitespace-nowrap"
        />

        <div className="grid gap-10 lg:grid-cols-3">
          {screenshots.map((shot) => (
            <BrowserFrame
              key={shot.title}
              shot={shot}
              onOpen={() => setActiveShot(shot)}
            />
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
            className="relative flex max-h-[91vh] w-full max-w-[min(90vw,1080px)] flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
              <Image
                src={activeShot.src}
                alt={activeShot.title}
                width={1024}
                height={590}
                className="max-h-[calc(91vh-3rem)] w-full object-contain"
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
