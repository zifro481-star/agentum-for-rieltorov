"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const reviews = [
  {
    id: "review-1",
    company: "Альянс Недвижимость",
    author: "Елена Соколова",
    role: "Руководитель отдела продаж",
    photo: "/images/testimonials/elena-sokolova.jpg",
    text: "Раньше таких клиентов просто отпускали — аресты, долги, банки не одобряли сделку. С Agentum Pro передаём кейс за 5 минут и получаем вознаграждение без ведения клиента.",
  },
  {
    id: "review-2",
    company: "Городской Риелтор",
    author: "Дмитрий Кузнецов",
    role: "Частный риелтор",
    photo: "/images/testimonials/dmitry-kuznetsov.jpg",
    text: "Удобное приложение и прозрачные статусы. Клиент с просрочкой по ипотеке заключил договор через две недели — я получил выплату и сохранил репутацию перед собственником.",
  },
  {
    id: "review-3",
    company: "DomPro Москва",
    author: "Анна Морозова",
    role: "Старший риелтор",
    photo: "/images/testimonials/anna-morozova.jpg",
    text: "Партнёрская программа закрывает нишу, которую мы сами не тянем юридически. Передаём сложные сделки профессионалам по банкротству — клиент доволен, мы зарабатываем.",
  },
  {
    id: "review-4",
    company: "Метриум Плюс",
    author: "Сергей Волков",
    role: "Руководитель агентства",
    photo: "/images/testimonials/sergey-volkov.jpg",
    text: "Объект с арестом висел месяцами — покупатели уходили. Передали клиента в Agentum Pro, через три недели сделка снова в работе, а мы получили партнёрское вознаграждение.",
  },
  {
    id: "review-5",
    company: "Capital Estate",
    author: "Ольга Петрова",
    role: "Риелтор",
    photo: "/images/testimonials/olga-petrova.jpg",
    text: "Клиент боялся потерять квартиру из-за налоговых долгов. Мы не юристы, но смогли предложить решение через Agentum Pro — клиент благодарен, рекомендации пошли дальше.",
  },
  {
    id: "review-6",
    company: "Новый Адрес",
    author: "Игорь Мельников",
    role: "Частный риелтор",
    photo: "/images/testimonials/igor-melnikov.jpg",
    text: "Просрочки по ипотеке — частая история. Раньше просто отказывался от таких объектов. Теперь передаю лид за пару минут и вижу статус в личном кабинете.",
  },
  {
    id: "review-7",
    company: "ProDom",
    author: "Мария Климова",
    role: "Директор по продажам",
    photo: "/images/testimonials/maria-klimova.jpg",
    text: "Для нашего агентства это дополнительный доход без лишней нагрузки на менеджеров. Юридическую часть берут на себя, мы сохраняем контакт с клиентом и получаем выплату.",
  },
  {
    id: "review-8",
    company: "Риелтор24",
    author: "Алексей Орлов",
    role: "Партнёр",
    photo: "/images/testimonials/alexey-orlov.jpg",
    text: "Понятные условия и быстрая обратная связь. Передал клиента с блокировкой счетов — договор подписали за 10 дней. Выплата пришла сразу после оформления.",
  },
];

const AUTOPLAY_MS = 5000;

function useVisibleCount() {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.matchMedia("(min-width: 1280px)").matches) {
        setVisibleCount(3);
        return;
      }

      if (window.matchMedia("(min-width: 768px)").matches) {
        setVisibleCount(2);
        return;
      }

      setVisibleCount(1);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  return visibleCount;
}

function ReviewCard({
  review,
}: {
  review: (typeof reviews)[number];
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-100/30 sm:p-7">
      <div className="mb-5 flex items-center gap-4 border-b border-slate-100 pb-5">
        <div className="shrink-0 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 p-1">
          <Image
            src={review.photo}
            alt={review.author}
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-full object-cover object-center"
            sizes="72px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold leading-snug text-slate-900">
            {review.company}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {review.author}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">{review.role}</p>
        </div>
      </div>

      <blockquote className="relative flex-1 pl-1">
        <Quote className="mb-3 h-5 w-5 text-blue-200" />
        <p className="text-sm leading-relaxed text-slate-600">{review.text}</p>
      </blockquote>
    </article>
  );
}

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const visibleCount = useVisibleCount();
  const maxIndex = Math.max(reviews.length - visibleCount, 0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) {
        return;
      }

      const normalized =
        maxIndex === 0
          ? 0
          : ((index % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);
      const slideWidth = track.clientWidth / visibleCount;

      track.scrollTo({
        left: normalized * slideWidth,
        behavior: "smooth",
      });
    },
    [maxIndex, visibleCount],
  );

  const goTo = useCallback(
    (index: number) => {
      if (maxIndex === 0) {
        setActiveIndex(0);
        return;
      }

      const normalized =
        ((index % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);
      setActiveIndex(normalized);
    },
    [maxIndex],
  );

  useEffect(() => {
    scrollToIndex(activeIndex);
  }, [activeIndex, scrollToIndex]);

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, maxIndex));
  }, [maxIndex]);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1);
  }, [activeIndex, goTo]);

  useEffect(() => {
    if (isPaused || maxIndex === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % (maxIndex + 1));
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [isPaused, maxIndex]);

  return (
    <Section id="reviews" className="bg-slate-50/70">
      <SectionHeader
        badge="Отзывы"
        title="Что говорят риелторы-партнёры"
        description="Агентства и частные риелторы делятся опытом работы с Agentum Pro."
      />

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          {maxIndex > 0 && (
            <button
              type="button"
              onClick={goPrev}
              aria-label="Предыдущие отзывы"
              className="inline-flex shrink-0 rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-md transition-colors hover:border-blue-200 hover:text-blue-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <div
            ref={trackRef}
            className="flex min-w-0 flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="shrink-0 snap-start px-3"
                style={{ flexBasis: `${100 / visibleCount}%` }}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>

          {maxIndex > 0 && (
            <button
              type="button"
              onClick={goNext}
              aria-label="Следующие отзывы"
              className="inline-flex shrink-0 rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-md transition-colors hover:border-blue-200 hover:text-blue-600"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {maxIndex > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Показать отзывы ${index + 1}`}
                onClick={() => goTo(index)}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  index === activeIndex
                    ? "w-8 bg-blue-600"
                    : "w-2.5 bg-slate-300 hover:bg-slate-400",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
