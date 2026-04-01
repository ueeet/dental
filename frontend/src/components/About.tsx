"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Shield,
  Clock,
  CreditCard,
  Award,
  Sparkles,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const advantages = [
  {
    icon: Shield,
    title: "Лицензированная клиника",
    description: "Работаем в полном соответствии с требованиями законодательства.",
  },
  {
    icon: Clock,
    title: "Без выходных",
    description: "Удобный график — запишитесь в любое подходящее время.",
  },
  {
    icon: CreditCard,
    title: "Удобная оплата",
    description: "Наличные, карты и рассрочка — выбирайте удобный способ.",
  },
  {
    icon: Award,
    title: "Опытные врачи",
    description: "Регулярное повышение квалификации и передовые методики.",
  },
  {
    icon: Sparkles,
    title: "Новейшее оборудование",
    description: "Точная диагностика и комфортное лечение на современной технике.",
  },
  {
    icon: Heart,
    title: "Индивидуальный подход",
    description: "Персональный план лечения с учётом ваших пожеланий.",
  },
];

const photoCards = [
  { label: "Интерьер клиники", rotate: "-rotate-2", translate: "translate-x-4" },
  { label: "Кабинет врача", rotate: "rotate-1", translate: "-translate-x-3" },
  { label: "Зона ресепшен", rotate: "-rotate-1", translate: "translate-x-2" },
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      /* ---- Section label + heading ---- */
      gsap.from("[data-animate='about-label'], [data-animate='about-heading']", {
        autoAlpha: 0,
        y: 40,
        filter: "blur(8px)",
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: "[data-animate='about-label']",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      /* ---- Description paragraphs ---- */
      gsap.from("[data-animate='about-desc']", {
        autoAlpha: 0,
        y: 30,
        filter: "blur(6px)",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: "[data-animate='about-desc']",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      /* ---- Photo cards ---- */
      gsap.from("[data-animate='photo-card']", {
        autoAlpha: 0,
        scale: 0.95,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.18,
        scrollTrigger: {
          trigger: "[data-animate='photo-card']",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      /* ---- Advantages batch ---- */
      ScrollTrigger.batch("[data-animate='advantage']", {
        onEnter: (elements) => {
          gsap.from(elements, {
            autoAlpha: 0,
            y: 30,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
          });
        },
        start: "top 90%",
        once: true,
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="about" className="bg-white py-24 md:py-32" ref={containerRef}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ===== Asymmetric 2-column layout ===== */}
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-20">

          {/* ---- LEFT: Text ---- */}
          <div>
            {/* Section label */}
            <p
              data-animate="about-label"
              className="font-[var(--font-mono)] text-xs font-semibold uppercase tracking-widest text-blue-600"
              style={{ visibility: "hidden" }}
            >
              О клинике
            </p>

            {/* Heading */}
            <h2
              data-animate="about-heading"
              className="mt-4 text-fluid-h1 font-[var(--font-heading)] font-bold leading-[1.1] tracking-tight text-gray-900"
              style={{ visibility: "hidden" }}
            >
              Современная стоматология
              <br className="hidden sm:block" />
              {" "}в&nbsp;центре города
            </h2>

            {/* Description */}
            <div className="mt-8 space-y-4 text-base leading-relaxed text-gray-600 sm:text-lg">
              <p data-animate="about-desc" style={{ visibility: "hidden" }}>
                Клиника{" "}
                <span className="font-semibold text-gray-900">IQ&nbsp;Dental</span>{" "}
                переехала по новому адресу —{" "}
                <span className="font-medium text-gray-900">просп.&nbsp;Мира,&nbsp;34</span>.
                Мы создали пространство, где передовые технологии сочетаются
                с&nbsp;комфортной атмосферой.
              </p>
              <p data-animate="about-desc" style={{ visibility: "hidden" }}>
                Каждый кабинет оснащён новейшим оборудованием для точной
                диагностики и&nbsp;безболезненного лечения. Наша команда
                профессионалов заботится о&nbsp;здоровье вашей улыбки, используя
                только проверенные материалы и&nbsp;современные методики.
              </p>
            </div>
          </div>

          {/* ---- RIGHT: Photo gallery (vertical stack with offsets) ---- */}
          <div className="relative flex flex-col items-center gap-6 py-4 lg:pt-8">
            {photoCards.map((card, idx) => (
              <div
                key={idx}
                data-animate="photo-card"
                className={cn(
                  "w-full max-w-sm aspect-[4/3] rounded-2xl",
                  "bg-gray-100 border border-gray-200",
                  "flex items-center justify-center",
                  "text-sm font-medium text-gray-400 select-none",
                  "transition-transform duration-300 hover:scale-[1.02]",
                  card.rotate,
                  card.translate
                )}
                style={{ visibility: "hidden" }}
              >
                {card.label}
              </div>
            ))}
          </div>
        </div>

        {/* ===== Advantages 3-column grid ===== */}
        <div className="group-hover-dim mt-24 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                data-animate="advantage"
                className={cn(
                  "rounded-2xl border border-gray-100 bg-white p-7",
                  "shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-100"
                )}
                style={{ visibility: "hidden" }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
