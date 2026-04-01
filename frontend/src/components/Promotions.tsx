"use client";

import { useState } from "react";
import { Clock, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const promotions = [
  {
    title: "Бесплатная консультация",
    subtitle: "0 ₽",
    description: "Первичный осмотр, диагностика и составление плана лечения — совершенно бесплатно для всех новых пациентов клиники.",
    conditions: "Для новых пациентов",
    deadline: null,
    isHit: false,
    accent: "from-[#2a3250] to-[#3a4565]",
  },
  {
    title: "Профчистка",
    subtitle: "–20%",
    description: "Скидка 20% на комплексную профессиональную гигиену полости рта: ультразвук, Air-Flow, полировка и фторирование.",
    conditions: "На полный комплекс",
    deadline: "30.06.2026",
    isHit: true,
    accent: "from-[#1e2540] to-[#2a3250]",
  },
  {
    title: "Имплантация под ключ",
    subtitle: "от 35 000 ₽",
    description: "Полный цикл имплантации: установка импланта, формирователь десны и металлокерамическая коронка по фиксированной цене.",
    conditions: "Имплант + коронка",
    deadline: "31.05.2026",
    isHit: false,
    accent: "from-[#2a3250] to-[#1a1f2e]",
  },
  {
    title: "Семейная скидка",
    subtitle: "10%",
    description: "Приходите всей семьёй и получайте скидку 10% на все виды лечения при одновременном обращении от двух членов семьи.",
    conditions: "От 2 членов семьи",
    deadline: null,
    isHit: false,
    accent: "from-[#353d5c] to-[#2a3250]",
  },
  {
    title: "Рассрочка",
    subtitle: "0%",
    description: "Оформите беспроцентную рассрочку на срок до 12 месяцев на все виды стоматологического лечения от 10 000 ₽.",
    conditions: "От 10 000 ₽",
    deadline: null,
    isHit: false,
    accent: "from-[#1e2540] to-[#353d5c]",
  },
];

export default function Promotions() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="promotions" className="py-[var(--space-section)] bg-[#1c1f26]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-14">
          <span className="font-[var(--font-mono)] text-fluid-small uppercase tracking-[0.15em] text-gray-400">
            Выгодные предложения
          </span>
          <h2 className="mt-3 font-[var(--font-heading)] text-fluid-h1 text-white">
            Акции
          </h2>
        </div>

        {/* Cards grid — 3 top, 2 bottom centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {promotions.map((promo, i) => (
            <div
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-2xl p-7 sm:p-8 transition-all duration-500",
                `bg-gradient-to-br ${promo.accent}`,
                "hover:scale-[1.02] hover:shadow-2xl hover:shadow-[var(--primary)]/15",
                // Last 2 cards center on lg
                i === 3 && "lg:col-start-1",
                i === 4 && "lg:col-start-2",
              )}
            >
              {/* Hit badge */}
              {promo.isHit && (
                <div className="absolute top-5 right-5 rounded-full bg-white/15 backdrop-blur-sm px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  Хит
                </div>
              )}

              {/* Big number/price */}
              <p className="font-[var(--font-mono)] text-4xl sm:text-5xl font-bold text-white/90 leading-none">
                {promo.subtitle}
              </p>

              {/* Title */}
              <h3 className="mt-4 font-[var(--font-heading)] text-xl font-semibold text-white">
                {promo.title}
              </h3>

              {/* Deadline / permanent badge */}
              <div className="mt-4 flex items-center gap-2">
                {promo.deadline ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                    <Clock className="h-3 w-3" />
                    до {promo.deadline}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                    <Clock className="h-3 w-3" />
                    Бессрочно
                  </span>
                )}
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                  {promo.conditions}
                </span>
              </div>

              {/* Expand arrow */}
              <div className="mt-6 flex items-center justify-between">
                <a
                  href="#booking"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/25"
                >
                  Записаться
                  <ArrowRight className="h-4 w-4" />
                </a>

                <button
                  onClick={(e) => { e.stopPropagation(); setActive(active === i ? null : i); }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all duration-300",
                    active === i ? "rotate-45 bg-white/20" : "group-hover:bg-white/20"
                  )}
                >
                  {active === i ? <X className="h-4 w-4" /> : <ArrowRight className="h-4 w-4 -rotate-45" />}
                </button>
              </div>

              {/* Expandable description */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-500 ease-out",
                  active === i ? "mt-5 max-h-40 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <p className="text-sm leading-relaxed text-white/70 border-t border-white/10 pt-5">
                  {promo.description}
                </p>
              </div>

              {/* Decorative circle */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 transition-transform duration-700 group-hover:scale-150" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
