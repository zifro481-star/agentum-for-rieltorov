import { TelegramIcon, MaxIcon } from "@/components/icons/SocialIcons";
import { PARTNER_LOGIN_URL } from "@/lib/utils";

const socialLinks = {
  telegram: "https://t.me/agentumpro",
  max: "https://max.ru",
};

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                A
              </span>
              <span className="text-sm font-semibold text-slate-900">
                Agentum Pro
              </span>
            </div>

            <p className="max-w-xs text-center text-sm text-slate-500 md:text-left">
              Партнёрская программа для риелторов. Передавайте сложных клиентов —
              получайте вознаграждение.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
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
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 md:items-end">
            <a
              href={PARTNER_LOGIN_URL}
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Стать партнёром
            </a>
            <p className="text-center text-xs text-slate-400 md:text-right">
              © {new Date().getFullYear()} Agentum Pro
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
