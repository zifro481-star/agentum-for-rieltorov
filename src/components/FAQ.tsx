"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "Нужно ли мне самому вести клиента?",
    answer:
      "Нет. После передачи лида всю юридическую работу берёт на себя команда Agentum Pro. Вы только отслеживаете статус в личном кабинете.",
  },
  {
    question: "Где я вижу статусы по клиентам?",
    answer:
      "Все переданные лиды и их текущие этапы отображаются в личном кабинете партнёра. Вы получаете уведомления при смене статуса.",
  },
  {
    question: "Когда происходит выплата вознаграждения?",
    answer:
      "Вознаграждение начисляется после того, как клиент подписывает договор с Agentum Pro. Срок и сумма отображаются в разделе «Финансы».",
  },
  {
    question: "Работаете ли вы по всей России?",
    answer:
      "Да, мы работаем с клиентами из всех регионов РФ. Консультации проводятся онлайн, при необходимости — очно.",
  },
  {
    question: "Можно ли передавать клиентов с долгами по налогам?",
    answer:
      "Да, налоговые долги — один из типов кейсов, с которыми мы работаем. Оцените ситуацию через форму, и мы подскажем возможные варианты.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" className="bg-slate-50/60">
      <SectionHeader
        badge="FAQ"
        title="Частые вопросы"
        description="Ответы на ключевые вопросы партнёров программы Agentum Pro."
      />

      <div className="mx-auto max-w-2xl space-y-3">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span className="font-medium text-slate-900">{item.question}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid transition-all duration-200",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
