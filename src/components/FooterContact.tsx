"use client";

import { Phone } from "lucide-react";
import { useState } from "react";
import { TelegramIcon, MaxIcon } from "@/components/icons/SocialIcons";
import { cn, CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "@/lib/utils";

const socialLinks = {
  telegram: "https://t.me/agentumpro",
  max: "https://max.ru",
};

export function FooterContact() {
  const [phoneOpen, setPhoneOpen] = useState(false);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Мы на связи
      </p>

      <div className="flex items-center gap-3">
        <a
          href={socialLinks.telegram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#229ED9] shadow-sm transition-all hover:border-[#229ED9]/30 hover:bg-[#229ED9]/5 hover:shadow-md"
        >
          <TelegramIcon className="h-5 w-5" />
        </a>
        <a
          href={socialLinks.max}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="MAX"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
        >
          <MaxIcon className="h-6 w-6" />
        </a>
        <button
          type="button"
          onClick={() => setPhoneOpen((prev) => !prev)}
          aria-label="Показать номер телефона"
          aria-expanded={phoneOpen}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-emerald-600 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-md",
            phoneOpen && "border-emerald-300 bg-emerald-50 shadow-md",
          )}
        >
          <Phone className="h-5 w-5" />
        </button>
      </div>

      <div
        className={cn(
          "grid w-full transition-all duration-300 ease-out",
          phoneOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="flex w-full flex-col items-center rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white px-5 py-4 text-center shadow-sm transition-colors hover:border-emerald-300 hover:from-emerald-100/80"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Позвоните нам
            </span>
            <span className="mt-2 text-2xl font-bold tracking-wide text-slate-900 sm:text-3xl">
              {CONTACT_PHONE_DISPLAY}
            </span>
            <span className="mt-2 text-sm text-slate-500">
              Нажмите на номер, чтобы позвонить
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
