import { FooterContact } from "@/components/FooterContact";
import { PARTNER_LOGIN_URL } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
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

          <FooterContact />

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
