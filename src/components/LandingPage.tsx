"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ShoppingBag,
  Users,
  Factory,
  Boxes,
  Store,
  Truck,
  Megaphone,
  Gift,
  BarChart3,
  MessageSquare,
  Check,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Palette,
  Globe,
} from "lucide-react";
import { DemoForm } from "@/components/DemoForm";

export type LandingStats = { partners: number; orders: number; salesCents: number; stores: number };

const ACCENT = "#a9853f";
const WINE = "#7c2e3b";

function compactMoney(cents: number) {
  const v = cents / 100;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${Math.round(v)}`;
}

function Counter({ to, format }: { to: number; format?: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{format ? format(n) : Math.round(n).toLocaleString("ru-RU")}</span>;
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const FEATURES = [
  { icon: ShoppingBag, title: "E‑commerce", desc: "Витрина, корзина, оформление и оплата из коробки." },
  { icon: Users, title: "CRM", desc: "Профили, сегменты, таймлайн активности и промокоды." },
  { icon: Factory, title: "Очередь производства", desc: "Канбан, этапы, приоритеты и распределение задач." },
  { icon: Boxes, title: "Склад", desc: "Остатки по точкам, перемещения, списания и возвраты." },
  { icon: Store, title: "Магазины", desc: "Финансы, долги, рейтинг и сводка для владельца." },
  { icon: Truck, title: "Доставка", desc: "Курьеры, маршруты, статусы и напоминания." },
  { icon: Megaphone, title: "Маркетинг", desc: "Автоматизации, брошенные корзины, рассылки." },
  { icon: Gift, title: "Лояльность", desc: "Бонусы, уровни и персональные предложения." },
  { icon: BarChart3, title: "Аналитика", desc: "Выручка, удержание, динамика — в реальном времени." },
  { icon: MessageSquare, title: "Внутренний чат", desc: "Командные каналы и переписка с клиентами." },
];

const TABS = [
  { id: "store", label: "Магазин" },
  { id: "crm", label: "CRM" },
  { id: "prod", label: "Производство" },
  { id: "analytics", label: "Аналитика" },
  { id: "mobile", label: "Мобайл" },
] as const;

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "/мес",
    tagline: "Для запуска первой витрины",
    features: ["1 магазин", "E‑commerce", "Базовая аналитика", "Email‑поддержка"],
    featured: false,
  },
  {
    name: "Business",
    price: "$49",
    period: "/мес",
    tagline: "Для растущего бизнеса",
    features: ["До 3 магазинов", "CRM + сегменты", "Промокоды", "Очередь производства", "Доставка"],
    featured: true,
  },
  {
    name: "Professional",
    price: "$129",
    period: "/мес",
    tagline: "Полный набор инструментов",
    features: ["До 10 магазинов", "Маркетинг‑автоматизация", "Лояльность", "Склад и перемещения", "Приоритетная поддержка"],
    featured: false,
  },
  {
    name: "Enterprise",
    price: "По запросу",
    period: "",
    tagline: "Безлимит и White Label",
    features: ["Безлимит магазинов", "White Label + домен", "SLA и выделенный менеджер", "Интеграции по API", "Онбординг"],
    featured: false,
  },
];

function MockWindow({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#15110f]/90 shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e06a5e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e3b341]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#5fb87a]" />
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}

function Bar({ w, c = "bg-white/10" }: { w: string; c?: string }) {
  return <div className={`h-2 rounded-full ${c}`} style={{ width: w }} />;
}

function DemoPanel({ tab }: { tab: (typeof TABS)[number]["id"] }) {
  if (tab === "store") {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        {["Выручка", "Заказы", "Долг сети"].map((t, i) => (
          <div key={t} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] uppercase tracking-widest text-white/40">{t}</p>
            <p className="mt-1 font-display text-xl text-white">{["$48.2K", "312", "$3.1K"][i]}</p>
          </div>
        ))}
        <div className="sm:col-span-3 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-end gap-1.5">
            {[40, 65, 50, 80, 60, 95, 72].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-[#7c2e3b] to-[#a9853f]" style={{ height: h }} />
            ))}
          </div>
          <Bar w="100%" />
        </div>
      </div>
    );
  }
  if (tab === "crm") {
    return (
      <div className="space-y-2">
        {[
          ["VIP", "Анна К.", "$2 480", "bg-[#a9853f]/20 text-[#d8b766]"],
          ["Новый", "Игорь М.", "$120", "bg-emerald-500/20 text-emerald-300"],
          ["Частый", "Лана П.", "$960", "bg-blue-500/20 text-blue-300"],
        ].map(([seg, name, sum, cls], i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-sm text-white">{(name as string)[0]}</span>
              <div>
                <p className="text-sm text-white">{name}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${cls}`}>{seg}</span>
              </div>
            </div>
            <p className="text-sm text-white/70">{sum}</p>
          </div>
        ))}
      </div>
    );
  }
  if (tab === "prod") {
    const cols = [
      ["Новые", 3],
      ["В работе", 2],
      ["Готовы", 4],
    ] as const;
    return (
      <div className="grid grid-cols-3 gap-3">
        {cols.map(([t, n]) => (
          <div key={t} className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="mb-2 text-[11px] uppercase tracking-wider text-white/40">{t}</p>
            <div className="space-y-2">
              {Array.from({ length: n }).map((_, i) => (
                <div key={i} className="rounded-lg border border-white/10 bg-black/20 p-2">
                  <Bar w="80%" />
                  <div className="mt-1.5" />
                  <Bar w="55%" c="bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (tab === "analytics") {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {["Retention", "AOV", "LTV", "Churn"].map((t, i) => (
            <div key={t} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <p className="text-[9px] uppercase tracking-wider text-white/40">{t}</p>
              <p className="mt-1 font-display text-lg text-white">{["68%", "$152", "$890", "4.2%"][i]}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <svg viewBox="0 0 300 80" className="h-20 w-full">
            <polyline
              fill="none"
              stroke={ACCENT}
              strokeWidth="2"
              points="0,60 40,52 80,58 120,40 160,44 200,26 240,30 300,14"
            />
          </svg>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-[200px]">
      <div className="rounded-[2rem] border border-white/15 bg-black/40 p-3">
        <div className="mb-3 h-1 w-12 mx-auto rounded-full bg-white/20" />
        <div className="space-y-2">
          <div className="rounded-xl bg-gradient-to-r from-[#7c2e3b] to-[#a9853f] p-3 text-white">
            <p className="text-[10px] opacity-80">Баланс бонусов</p>
            <p className="font-display text-xl">1 240</p>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2">
              <div className="h-8 w-8 rounded-lg bg-white/10" />
              <div className="flex-1 space-y-1">
                <Bar w="70%" />
                <Bar w="40%" c="bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LandingPage({ stats }: { stats: LandingStats }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("store");
  const [branded, setBranded] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#0c0a09] text-white antialiased"
      onMouseMove={(e) =>
        setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 })
      }
    >
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#7c2e3b]/25 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-[#a9853f]/15 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Nav */}
      <header className="safe-top fixed inset-x-0 top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/welcome" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#7c2e3b] to-[#a9853f] font-display text-lg">
              L
            </span>
            <span className="font-display text-lg tracking-tight">Levrim Commerce</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#features" className="transition hover:text-white">Возможности</a>
            <a href="#platform" className="transition hover:text-white">Платформа</a>
            <a href="#pricing" className="transition hover:text-white">Цены</a>
            <Link href="/login" className="transition hover:text-white">Войти</Link>
          </div>
          <a
            href="#get-started"
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#0c0a09] transition hover:bg-white/90"
          >
            Начать
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="relative px-5 pb-20 pt-36 sm:pt-44">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur"
              >
                <Sparkles size={13} className="text-[#d8b766]" />
                Единая платформа для коммерции
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="mt-5 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl"
              >
                Запускайте, управляйте и масштабируйте
                <span className="bg-gradient-to-r from-[#d8b766] to-[#e0a0aa] bg-clip-text text-transparent"> ваш бизнес</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="mt-5 max-w-xl text-lg text-white/60"
              >
                Всё для управления магазинами, складом, CRM, производством, маркетингом и операциями — на одной платформе.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <a
                  href="#get-started"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7c2e3b] to-[#a9853f] px-6 py-3.5 font-medium text-white shadow-lg shadow-[#7c2e3b]/30 transition hover:brightness-110"
                >
                  Заказать демо <ArrowRight size={17} />
                </a>
                <a
                  href="#get-started"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 font-medium text-white backdrop-blur transition hover:bg-white/10"
                >
                  Начать бесплатно
                </a>
              </motion.div>
            </div>

            {/* Faux-3D dashboard stack */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
              style={{ perspective: 1200 }}
            >
              <motion.div
                style={{
                  rotateY: mouse.x * 6,
                  rotateX: -mouse.y * 6,
                  transformStyle: "preserve-3d",
                }}
                className="relative"
              >
                <div style={{ transform: "translateZ(40px)" }}>
                  <MockWindow>
                    <DemoPanel tab="store" />
                  </MockWindow>
                </div>
                <div className="absolute -bottom-10 -left-6 w-44 rotate-[-6deg] rounded-2xl border border-white/10 bg-[#15110f]/95 p-3 shadow-2xl" style={{ transform: "translateZ(80px)" }}>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Новый заказ</p>
                  <p className="mt-1 text-sm text-white">#LVR‑1042</p>
                  <Bar w="100%" c="bg-gradient-to-r from-[#7c2e3b] to-[#a9853f]" />
                </div>
                <div className="absolute -right-4 -top-8 w-40 rotate-[5deg] rounded-2xl border border-white/10 bg-[#15110f]/95 p-3 shadow-2xl" style={{ transform: "translateZ(100px)" }}>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">Retention</p>
                  <p className="mt-1 font-display text-2xl text-[#d8b766]">68%</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Social proof */}
      <section className="border-y border-white/10 bg-white/[0.02] px-5 py-14">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {[
            { label: "Партнёров", value: <Counter to={Math.max(stats.partners, 0)} /> },
            { label: "Заказов обработано", value: <Counter to={Math.max(stats.orders, 0)} /> },
            { label: "Объём продаж", value: <Counter to={Math.max(stats.salesCents, 0)} format={compactMoney} /> },
            { label: "Активных магазинов", value: <Counter to={Math.max(stats.stores, 0)} /> },
          ].map((s) => (
            <Reveal key={s.label}>
              <p className="font-display text-4xl text-white sm:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm uppercase tracking-widest text-white/40">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl sm:text-4xl">Один продукт — весь ваш бизнес</h2>
            <p className="mt-3 text-white/60">Десять модулей, которые обычно живут в разных сервисах. Здесь они работают вместе.</p>
          </Reveal>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 0.06}>
                <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:border-[#a9853f]/40 hover:bg-white/[0.06]">
                  <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#7c2e3b]/40 to-[#a9853f]/30 text-[#d8b766]">
                    <f.icon size={20} />
                  </div>
                  <h3 className="font-display text-lg text-white">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-white/55">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive platform demo */}
      <section id="platform" className="px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl sm:text-4xl">Загляните внутрь платформы</h2>
            <p className="mt-3 text-white/60">Переключайтесь между разделами — всё выглядит как настоящий интерфейс.</p>
          </Reveal>
          <Reveal className="mt-10">
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    tab === t.id
                      ? "border-[#a9853f]/50 bg-[#a9853f]/15 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <MockWindow>
                <DemoPanel tab={tab} />
              </MockWindow>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* CRM + Operations split */}
      <section className="px-5 py-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          {[
            {
              eyebrow: "CRM & Маркетинг",
              title: "Знайте каждого клиента",
              points: ["Сегменты", "Таймлайн клиента", "Возврат брошенных корзин", "Промокоды", "Программа лояльности"],
              icon: Users,
            },
            {
              eyebrow: "Операции",
              title: "Производство под контролем",
              points: ["Магазины и финансы", "Склад и перемещения", "Очередь производства", "Доставка"],
              icon: Factory,
            },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-8">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#7c2e3b]/30 text-[#d8b766]">
                  <b.icon size={22} />
                </div>
                <p className="text-xs uppercase tracking-widest text-[#d8b766]">{b.eyebrow}</p>
                <h3 className="mt-2 font-display text-2xl text-white">{b.title}</h3>
                <ul className="mt-5 space-y-2.5">
                  {b.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-white/70">
                      <Check size={16} className="text-[#d8b766]" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* White label */}
      <section className="px-5 py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <Palette size={13} className="text-[#d8b766]" /> White Label
            </div>
            <h2 className="font-display text-3xl sm:text-4xl">Ваш бренд, ваш домен</h2>
            <p className="mt-3 text-white/60">Логотип, цвета, типографика и собственный домен. Переключите, чтобы увидеть разницу.</p>
          </Reveal>

          <Reveal className="mt-10">
            <div className="mb-5 flex justify-center">
              <div className="inline-flex rounded-full border border-white/10 bg-black/20 p-1 text-sm">
                <button
                  onClick={() => setBranded(false)}
                  className={`rounded-full px-4 py-1.5 transition ${!branded ? "bg-white text-[#0c0a09]" : "text-white/60"}`}
                >
                  До
                </button>
                <button
                  onClick={() => setBranded(true)}
                  className={`rounded-full px-4 py-1.5 transition ${branded ? "bg-white text-[#0c0a09]" : "text-white/60"}`}
                >
                  После
                </button>
              </div>
            </div>
            <motion.div
              key={branded ? "after" : "before"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <MockWindow>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-xl font-display ${
                        branded ? "bg-gradient-to-br from-[#7c2e3b] to-[#a9853f] text-white" : "bg-white/10 text-white/40"
                      }`}
                    >
                      {branded ? "L" : "?"}
                    </span>
                    <span className={branded ? "font-display text-white" : "text-white/40"}>
                      {branded ? "Levrim Patisserie" : "your‑store.app"}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-white/40">
                    <Globe size={12} /> {branded ? "shop.levrim.com" : "tenant.platform.app"}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`h-20 rounded-xl ${
                        branded ? "bg-gradient-to-br from-[#7c2e3b]/40 to-[#a9853f]/20" : "bg-white/5"
                      }`}
                    />
                  ))}
                </div>
              </MockWindow>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl sm:text-4xl">Простые и честные тарифы</h2>
            <p className="mt-3 text-white/60">Начните бесплатно и растите вместе с платформой.</p>
          </Reveal>
          <div className="mt-14 grid gap-4 lg:grid-cols-4">
            {PLANS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.06}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl border p-6 ${
                    p.featured
                      ? "border-[#a9853f]/50 bg-gradient-to-b from-[#a9853f]/15 to-transparent"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  {p.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#7c2e3b] to-[#a9853f] px-3 py-1 text-[11px] font-medium text-white">
                      Популярный
                    </span>
                  )}
                  <h3 className="font-display text-xl text-white">{p.name}</h3>
                  <p className="mt-1 text-xs text-white/50">{p.tagline}</p>
                  <p className="mt-4 font-display text-3xl text-white">
                    {p.price}
                    <span className="text-base font-normal text-white/40">{p.period}</span>
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                        <Check size={15} className="mt-0.5 shrink-0 text-[#d8b766]" /> {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#get-started"
                    className={`mt-6 inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      p.featured
                        ? "bg-gradient-to-r from-[#7c2e3b] to-[#a9853f] text-white hover:brightness-110"
                        : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {p.name === "Enterprise" ? "Связаться" : "Выбрать"}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Get started / booking */}
      <section id="get-started" className="px-5 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <ShieldCheck size={13} className="text-[#d8b766]" /> Запуск без участия администратора
            </div>
            <h2 className="mt-5 font-display text-3xl leading-tight sm:text-4xl">
              Готовы запустить свою платформу?
            </h2>
            <p className="mt-4 text-white/60">
              Оставьте заявку — проведём демонстрацию или сразу откроем пробный период. После регистрации мастер настройки создаст ваш магазин автоматически: домен, тема, каталог и выбранные модули.
            </p>
            <ul className="mt-6 space-y-3">
              {["Автоматическое создание тенанта и поддомена", "Импорт каталога и применение темы", "Активация выбранных модулей"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-white/70">
                  <Check size={16} className="text-[#d8b766]" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <DemoForm />
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-5 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-white/40 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#7c2e3b] to-[#a9853f] font-display text-white">L</span>
            <span className="text-white/70">Levrim Commerce</span>
          </div>
          <p>© {new Date().getFullYear()} Levrim Commerce. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
