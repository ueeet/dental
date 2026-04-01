"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
              
            >
              О клинике
            </p>

            {/* Heading */}
            <h2
              data-animate="about-heading"
              className="mt-4 text-fluid-h1 font-[var(--font-heading)] font-bold leading-[1.1] tracking-tight text-gray-900"
              
            >
              Современная стоматология
              <br className="hidden sm:block" />
              {" "}в&nbsp;центре города
            </h2>

            {/* Description */}
            <div className="mt-8 space-y-4 text-base leading-relaxed text-gray-600 sm:text-lg">
              <p data-animate="about-desc" >
                Клиника{" "}
                <span className="font-semibold text-gray-900">IQ&nbsp;Dental</span>{" "}
                переехала по новому адресу —{" "}
                <span className="font-medium text-gray-900">просп.&nbsp;Мира,&nbsp;34</span>.
                Мы создали пространство, где передовые технологии сочетаются
                с&nbsp;комфортной атмосферой.
              </p>
              <p data-animate="about-desc" >
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
                
              >
                {card.label}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
