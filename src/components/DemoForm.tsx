"use client";

import { useState } from "react";
import { Check, Loader2, CalendarClock } from "lucide-react";
import { submitDemo } from "@/lib/api";

const fieldCls =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 outline-none backdrop-blur transition focus:border-[#c79a3f]/60 focus:bg-white/10";

export function DemoForm({ defaultIntent = "demo" }: { defaultIntent?: "demo" | "trial" }) {
  const [intent, setIntent] = useState<"demo" | "trial">(defaultIntent);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setBusy(true);
    setError(null);
    const res = await submitDemo({ ...form, intent });
    setBusy(false);
    if (res.ok) setDone(true);
    else setError(res.error ?? "Ошибка");
  };

  if (done) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#7c2e3b] text-white">
          <Check size={26} />
        </div>
        <h3 className="mt-5 font-display text-2xl text-white">Заявка отправлена</h3>
        <p className="mt-2 text-white/60">
          Спасибо! Мы свяжемся с вами в ближайшее время и подтвердим{" "}
          {intent === "trial" ? "запуск пробного периода" : "время демонстрации"}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
      <div className="mb-5 inline-flex rounded-full border border-white/10 bg-black/20 p-1 text-sm">
        <button
          onClick={() => setIntent("demo")}
          className={`rounded-full px-4 py-1.5 transition ${intent === "demo" ? "bg-[#7c2e3b] text-white" : "text-white/60 hover:text-white"}`}
        >
          Заказать демо
        </button>
        <button
          onClick={() => setIntent("trial")}
          className={`rounded-full px-4 py-1.5 transition ${intent === "trial" ? "bg-[#7c2e3b] text-white" : "text-white/60 hover:text-white"}`}
        >
          Пробный период
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input className={fieldCls} placeholder="Имя *" value={form.name} onChange={set("name")} />
        <input className={fieldCls} placeholder="Компания" value={form.company} onChange={set("company")} />
        <input className={fieldCls} placeholder="Email *" type="email" value={form.email} onChange={set("email")} />
        <input className={fieldCls} placeholder="Телефон" value={form.phone} onChange={set("phone")} />
        {intent === "demo" && (
          <>
            <input className={fieldCls} type="date" value={form.preferredDate} onChange={set("preferredDate")} />
            <input className={fieldCls} type="time" value={form.preferredTime} onChange={set("preferredTime")} />
          </>
        )}
        <textarea
          className={`${fieldCls} sm:col-span-2`}
          rows={3}
          placeholder="Комментарий (необязательно)"
          value={form.message}
          onChange={set("message")}
        />
      </div>

      {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}

      <button
        onClick={submit}
        disabled={busy || !form.name || !form.email}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7c2e3b] to-[#a9853f] px-6 py-3.5 font-medium text-white shadow-lg shadow-[#7c2e3b]/30 transition hover:brightness-110 disabled:opacity-50"
      >
        {busy ? <Loader2 size={18} className="animate-spin" /> : <CalendarClock size={18} />}
        {busy ? "Отправляем…" : intent === "trial" ? "Начать бесплатно" : "Забронировать демо"}
      </button>
      <p className="mt-3 text-center text-xs text-white/40">
        Нажимая, вы соглашаетесь, что мы свяжемся с вами по указанным контактам.
      </p>
    </div>
  );
}
