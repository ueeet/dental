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
    title: "Имплантация под ключ от 35 000 ₽",
    description:
      "Полный цикл имплантации: установка импланта, формирователь десны и металлокерамическая коронка по фиксированной цене.",
    conditions: "Имплант + коронка в одну стоимость",
    deadline: "31.05.2026",
    isHit: false,
  },
  {
    icon: Users,
    title: "Семейная скидка 10%",
    description:
      "Приходите всей семьёй и получайте скидку 10% на все виды лечения при одновременном обращении от двух членов семьи.",
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

  useGSAP(
    () => {
      gsap.from("[data-animate='heading']", {
        autoAlpha: 0,
        y: 20,
        duration: 0.5,
        scrollTrigger: {
          trigger: "[data-animate='heading']",
          start: "top 80%",
          once: true,
        },
      });

      ScrollTrigger.batch("[data-animate='promo-card']", {
        onEnter: (batch) => {
          gsap.from(batch, {
            autoAlpha: 0,
            y: 30,
            duration: 0.4,
            stagger: 0.1,
          });
        },
        start: "top 85%",
        once: true,
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="promotions" ref={containerRef} className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div
          data-animate="heading"
          className="text-center mb-14"
          style={{ visibility: "hidden" }}
        >
          <span className="inline-block text-sm font-semibold tracking-wider uppercase text-blue-600 mb-3">
            Выгодные предложения
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Акции и специальные предложения
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Качественная стоматология может быть доступной. Воспользуйтесь
            нашими актуальными акциями и сэкономьте на заботе о здоровье.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo, index) => {
            const Icon = promo.icon;

            return (
              <div
                key={index}
                data-animate="promo-card"
                className={cn(
                  "relative group flex flex-col rounded-2xl border bg-white p-6 transition-shadow duration-300 hover:shadow-xl",
                  promo.isHit
                    ? "border-blue-200 ring-1 ring-blue-100"
                    : "border-gray-100"
                )}
                style={{ visibility: "hidden" }}
              >
                {promo.isHit && (
                  <span className="absolute -top-3 right-5 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
                    <Tag className="h-3 w-3" />
                    Хит
                  </span>
                )}

                <div className="mb-4 flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      promo.isHit
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-600"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    {promo.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">
                  {promo.description}
                </p>

                <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600">
                    {promo.conditions}
                  </span>

                  {promo.deadline ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 font-medium text-red-600">
                      <Clock className="h-3 w-3" />
                      до {promo.deadline}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 font-medium text-green-600">
                      <Clock className="h-3 w-3" />
                      Бессрочно
                    </span>
                  )}
                </div>

                <a
                  href="#contacts"
                  className={cn(
                    "inline-flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-semibold transition-colors duration-200",
                    promo.isHit
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  )}
                >
                  Записаться
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
