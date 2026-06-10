"use client";

import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PARTNER_LOGIN_URL } from "@/lib/utils";

const HERO_IMAGE = "/images/hero-residential-complex.jpg";

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO_IMAGE}
        alt=""
        fetchPriority="high"
        decoding="sync"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: "88% center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white from-0% via-white/88 via-34% to-white/5 to-100%" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/30" />
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex items-center py-10 md:py-14"
      style={{ minHeight: "calc(100dvh - 4rem)" }}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="mb-6 inline-flex min-h-12 items-center gap-3 rounded-full border-2 border-blue-200 bg-blue-50 px-6 py-3 text-base font-semibold text-blue-700 shadow-sm sm:min-h-14 sm:gap-3.5 sm:px-8 sm:py-3.5 sm:text-lg md:px-10 md:py-4">
            <TrendingUp className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
            Партнёрская программа для риелторов
          </span>

          <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Зарабатывайте{" "}
            <span className="bg-blue-600 bg-clip-text text-transparent">
              от 30 до 150 тыс. рублей
            </span>{" "}
            за рекомендацию клиентов, которым нужна помощь с долгами
          </h1>

          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            Если у вашего клиента аресты, просрочки по кредитам, проблемы с
            ипотекой, долги — передайте его в Agentum Pro. Мы предложим
            законное решение, а вы получите гарантированно партнерское
            вознаграждение.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              className="hidden sm:inline-flex"
              href={PARTNER_LOGIN_URL}
              external
            >
              Стать партнёром
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="https://t.me/Agentumpropartner_bot"
              external
            >
              Обсудить сотрудничество
            </Button>
          </div>

          <ul className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {[
              "Без ведения клиента",
              "Статус в личном кабинете",
              "Выплата после договора",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
