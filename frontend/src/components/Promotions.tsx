"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Gift, Percent, Star, Users, CreditCard, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const promotions = [
  {
    icon: Gift,
    title: "Бесплатная консультация",
    description:
      "Первичный осмотр, диагностика и составление плана лечения — совершенно бесплатно для всех новых пациентов клиники.",
    conditions: "Для новых пациентов",
    deadline: null,
    isHit: false,
  },
  {
    icon: Percent,
    title: "Профессиональная чистка -20%",
    description:
      "Скидка 20% на комплексную профессиональную гигиену полости рта: ультразвук, Air-Flow, полировка и фторирование.",
    conditions: "Скидка действует на полный комплекс",
    deadline: "30.06.2026",
    isHit: true,
  },
  {
    icon: Star,
    title: "Имплантация под ключ",
    description:
      "Полный цикл имплантации: установка импланта, формирователь десны и металлокерамическая коронка по фиксированной цене.",
    price: "от 35 000 ₽",
    conditions: "Имплант + коронка в одну стоимость",
    deadline: "31.05.2026",
    isHit: false,
  },
  {
    icon: Users,
    title: "Семейная скидка",
    description:
      "Приходите всей семьёй и получайте скидку 10% на все виды лечения при одновременном обращении от двух членов семьи.",
    price: "10%",
    conditions: "От 2 членов семьи",
    deadline: null,
    isHit: false,
  },
  {
    icon: CreditCard,
    title: "Рассрочка 0%",
    description:
      "Оформите беспроцентную рассрочку на срок до 12 месяцев на все виды стоматологического лечения от 10 000 ₽.",
    conditions: "На лечение от 10 000 ₽",
    deadline: null,
    isHit: false,
  },
];

export default function Promotions() {
  const containerRef = useRef<HTMLElement>(null);


  return (
    <section
      id="promotions"
      ref={containerRef}
      className="py-[var(--space-section)] bg-[var(--background)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section label + heading */}
        <div
          data-animate="promo-heading"
          className="mb-16"
          
        >
          <span className="font-[var(--font-mono)] text-fluid-small uppercase tracking-[0.15em] text-muted-foreground">
            Выгодные предложения
          </span>
          <h2 className="mt-3 font-[var(--font-heading)] text-fluid-h1 text-foreground">
            Акции и специальные
            <br />
            предложения
          </h2>
          <p className="mt-4 max-w-xl text-fluid-body text-muted-foreground">
            Качественная стоматология может быть доступной. Воспользуйтесь
            нашими актуальными акциями.
          </p>
        </div>

        {/* Promo cards — full-width horizontal layout */}
        <div className="group-hover-dim flex flex-col gap-4">
          {promotions.map((promo, index) => {
            const Icon = promo.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                data-animate="promo-card"
                className={cn(
                  "relative flex flex-col gap-6 rounded-2xl p-6 sm:p-8 transition-all duration-300 md:flex-row md:items-center md:justify-between",
                  isEven
                    ? "bg-white"
                    : "bg-[#f0f4ff]",
                  "hover:shadow-lg"
                )}
                
              >
                {/* Hit badge */}
                {promo.isHit && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    <Tag className="h-3 w-3" />
                    Хит
                  </span>
                )}

                {/* Left side: icon + text */}
                <div className="flex items-start gap-5 md:flex-1">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-[var(--font-heading)] text-fluid-h3 text-foreground">
                      {promo.title}
                      {"price" in promo && promo.price && (
                        <span className="ml-2 font-[var(--font-mono)] text-primary">
                          {promo.price}
                        </span>
                      )}
                    </h3>
                    <p className="mt-1.5 max-w-lg text-fluid-small text-muted-foreground leading-relaxed">
                      {promo.description}
                    </p>
                  </div>
                </div>

                {/* Right side: conditions + deadline + CTA */}
                <div className="flex flex-wrap items-center gap-3 md:flex-shrink-0 md:gap-4">
                  <span className="inline-flex items-center rounded-full bg-foreground/5 px-4 py-1.5 text-fluid-small font-medium text-foreground/70">
                    {promo.conditions}
                  </span>

                  {promo.deadline ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-1.5 text-fluid-small font-medium text-red-600">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="font-[var(--font-mono)]">до {promo.deadline}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-4 py-1.5 text-fluid-small font-medium text-green-600">
                      <Clock className="h-3.5 w-3.5" />
                      Бессрочно
                    </span>
                  )}

                  <a
                    href="#booking"
                    className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
                  >
                    Записаться
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
