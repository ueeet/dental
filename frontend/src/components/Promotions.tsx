"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const promotions = [
  {
    title: "Бесплатная консультация",
    description: "Первичный осмотр, диагностика и составление плана лечения — бесплатно для всех новых пациентов клиники.",
    badge: "Для новых пациентов",
    deadline: null,
    cta: "Записаться",
    accent: "from-[#2a3250]/8 to-[#2a3250]/4",
    border: "border-[#2a3250]/10",
  },
  {
    title: "Профчистка –20%",
    description: "Скидка 20% на комплексную профессиональную гигиену: ультразвук, Air-Flow, полировка и фторирование.",
    badge: "Хит",
    deadline: "30.06.2026",
    cta: "Записаться",
    accent: "from-slate-100 to-gray-100",
    border: "border-slate-200",
  },
  {
    title: "Имплантация под ключ от 35 000 ₽",
    description: "Полный цикл имплантации: установка импланта, формирователь десны и металлокерамическая коронка по фиксированной цене.",
    badge: "Ограниченное предложение",
    deadline: "31.05.2026",
    cta: "Узнать подробнее",
    accent: "from-gray-100 to-slate-100",
    border: "border-gray-200",
  },
  {
    title: "Семейная скидка 10%",
    description: "Приходите всей семьёй и получайте скидку 10% на все виды лечения при одновременном обращении от двух членов семьи.",
    badge: "Бессрочно",
    deadline: null,
    cta: "Записаться",
    accent: "from-[#2a3250]/6 to-[#2a3250]/3",
    border: "border-[#2a3250]/8",
  },
];

export default function Promotions() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".promotions-heading", {
      y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: ".promotions-heading", start: "top 88%", once: true },
    });

    gsap.from(".promo-card", {
      y: 60, opacity: 0, scale: 0.94, duration: 0.8, stagger: 0.12, ease: "power3.out",
      scrollTrigger: { trigger: ".promos-grid", start: "top 85%", once: true },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="promotions" className="relative bg-background pb-28 pt-16 sm:pt-20">
      {/* Accent orb */}
      <div className="pointer-events-none absolute right-1/4 top-0 h-80 w-80 rounded-full bg-primary/4 blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="promotions-heading mb-14">
          <span className="font-[var(--font-mono)] text-fluid-small uppercase tracking-[0.15em] text-muted-foreground">
            Выгодные предложения
          </span>
          <h2 className="mt-3 font-[var(--font-heading)] text-fluid-h1 text-foreground">Акции</h2>
        </div>

        <div className="promos-grid grid grid-cols-1 gap-5 md:grid-cols-2">
          {promotions.map((promo, i) => (
            <div
              key={i}
              className={cn(
                "promo-card group relative min-h-[320px] overflow-hidden rounded-3xl border p-8 sm:p-10",
                "flex flex-col justify-between",
                "bg-gradient-to-br",
                promo.accent,
                promo.border,
                "liquid-glass-light",
                "transition-all duration-500 hover:shadow-2xl hover:shadow-primary/8 hover:scale-[1.015]"
              )}
            >
              {/* Decorative blurred orb inside card */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary/6 blur-2xl transition-transform duration-700 group-hover:scale-125" />
              <div className="pointer-events-none absolute -bottom-8 right-16 h-32 w-32 rounded-full bg-primary/4 blur-2xl transition-transform duration-700 group-hover:scale-110 group-hover:translate-x-4" />

              {/* Badge */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {promo.badge}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 mt-auto">
                <h3 className="font-[var(--font-heading)] text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                  {promo.title}
                </h3>
                <p className="mt-3 max-w-sm text-base leading-relaxed text-foreground/70">
                  {promo.description}
                </p>
                {promo.deadline && (
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-foreground/50">
                    <Clock className="h-3.5 w-3.5" />
                    до {promo.deadline}
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="relative z-10 mt-6">
                <a
                  href="#booking"
                  className="inline-flex items-center gap-2 border-b-2 border-foreground pb-1 text-base font-semibold text-foreground transition-all duration-300 group-hover:gap-3"
                >
                  {promo.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wave → Booking (dark) */}
    </section>
  );
}
