"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";

type FormData = {
  name: string;
  phone: string;
  telegram: string;
  city: string;
  profession: string;
};

const initialFormData: FormData = {
  name: "",
  phone: "",
  telegram: "",
  city: "",
  profession: "",
};

export function LeadForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, website: honeypot }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Не удалось отправить заявку");
        return;
      }

      setIsSubmitted(true);
    } catch {
      setError("Ошибка сети. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Section id="lead-form">
        <div className="mx-auto max-w-lg rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <Send className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Заявка отправлена!</h3>
          <p className="mt-2 text-sm text-slate-600">
            Мы свяжемся с вами в ближайшее время для подключения к партнёрской
            программе.
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section id="lead-form">
      <SectionHeader
        badge="Регистрация"
        title="Стать партнёром Agentum Pro"
        description="Заполните форму — мы свяжемся с вами и откроем доступ к личному кабинету."
      />

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-lg space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md sm:p-8"
      >
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Имя
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Александр"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
            Телефон
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+7 (999) 000-00-00"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label htmlFor="telegram" className="mb-1.5 block text-sm font-medium text-slate-700">
            Telegram
          </label>
          <input
            id="telegram"
            type="text"
            value={formData.telegram}
            onChange={(e) => handleChange("telegram", e.target.value)}
            placeholder="@username"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-slate-700">
              Город
            </label>
            <input
              id="city"
              type="text"
              required
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Москва"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="profession"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Профессия
            </label>
            <input
              id="profession"
              type="text"
              required
              value={formData.profession}
              onChange={(e) => handleChange("profession", e.target.value)}
              placeholder="Риелтор"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? "Отправка..." : "Отправить заявку"}
          {!isLoading && <Send className="h-4 w-4" />}
        </Button>

        <p className="text-center text-xs text-slate-500">
          Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
        </p>
      </form>
    </Section>
  );
}
