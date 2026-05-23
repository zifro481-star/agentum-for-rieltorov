"use client";

import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { PARTNER_LOGIN_URL } from "@/lib/utils";

export function Hero() {
  return (
    <Section
      id="hero"
      className="relative overflow-hidden pb-10 pt-8 md:pb-14 md:pt-12"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl" />
      </div>

      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <TrendingUp className="h-3.5 w-3.5" />
            Партнёрская программа для риелторов
          </span>

          <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Конвертируйте сложные сделки в{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              стабильный доход
            </span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            Если у клиента аресты, кредиты, ипотека, долги — передайте его в
            Agentum Pro. Мы предложим законное решение, а вы получите
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
              href={PARTNER_LOGIN_URL}
              external
            >
              Обсудить сотрудничество
            </Button>
          </div>

          <ul className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
            {["Без ведения клиента", "Статус в личном кабинете", "Выплата после договора"].map(
              (item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/60">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">
                Интерфейс лида
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Активный
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Статус
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Передан юристу
                </p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                  Потенциальное вознаграждение
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  40 000 ₽
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-xs text-slate-500">Клиент</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-800">
                    Иванов А.С.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-xs text-slate-500">Город</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-800">
                    Москва
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10" />
        </div>
      </div>
    </Section>
  );
}
