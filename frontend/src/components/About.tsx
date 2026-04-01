"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const photos = [
  { label: "Ресепшен", color: "from-blue-400 to-blue-600" },
  { label: "Кабинет терапии", color: "from-sky-400 to-indigo-500" },
  { label: "Панорамный снимок", color: "from-indigo-400 to-purple-500" },
  { label: "Зона ожидания", color: "from-cyan-400 to-blue-500" },
  { label: "Хирургический кабинет", color: "from-blue-500 to-indigo-600" },
  { label: "Стерилизация", color: "from-violet-400 to-blue-600" },
  { label: "Детский кабинет", color: "from-sky-300 to-blue-500" },
  { label: "Оборудование", color: "from-blue-600 to-indigo-700" },
];

export default function About() {
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    const section = sectionRef.current;
    if (!grid || !section) return;

    const ctx = gsap.context(() => {
      // Animate the grid's 3D rotation and vertical position on scroll
      gsap.fromTo(
        grid,
        {
          rotateX: 55,
          rotateZ: -12,
          translateY: "15%",
          scale: 0.85,
        },
        {
          rotateX: 0,
          rotateZ: 0,
          translateY: "-10%",
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      // Parallax individual cards at different speeds
      const cards = grid.querySelectorAll("[data-photo]");
      cards.forEach((card, i) => {
        const speed = (i % 3 === 0) ? -40 : (i % 3 === 1) ? -20 : -60;
        gsap.to(card, {
          y: speed,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="bg-white py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Text section */}
        <div className="mx-auto max-w-2xl text-center mb-16 lg:mb-20">
          <p className="font-[var(--font-mono)] text-xs font-semibold uppercase tracking-widest text-blue-600">
            О клинике
          </p>
          <h2 className="mt-4 text-fluid-h1 font-[var(--font-heading)] font-bold leading-[1.1] tracking-tight text-gray-900">
            Современная стоматология
            <br className="hidden sm:block" />
            {" "}в&nbsp;центре города
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-600 sm:text-lg">
            <p>
              Клиника{" "}
              <span className="font-semibold text-gray-900">IQ&nbsp;Dental</span>{" "}
              переехала по новому адресу —{" "}
              <span className="font-medium text-gray-900">просп.&nbsp;Мира,&nbsp;34</span>.
              Мы создали пространство, где передовые технологии сочетаются
              с&nbsp;комфортной атмосферой.
            </p>
            <p>
              Каждый кабинет оснащён новейшим оборудованием для точной
              диагностики и&nbsp;безболезненного лечения. Наша команда
              профессионалов заботится о&nbsp;здоровье вашей улыбки, используя
              только проверенные материалы и&nbsp;современные методики.
            </p>
          </div>
        </div>

        {/* 3D Isometric Photo Grid */}
        <div className="relative" style={{ perspective: "1200px" }}>
          <div
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {photos.map((photo, idx) => (
              <div
                key={idx}
                data-photo
                className="group relative overflow-hidden rounded-2xl"
                style={{
                  aspectRatio: idx % 3 === 0 ? "3/4" : "4/3",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Gradient placeholder */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${photo.color} transition-transform duration-700 ease-out group-hover:scale-110`}
                />

                {/* Label overlay */}
                <div className="absolute inset-0 flex items-end p-4 sm:p-5">
                  <div className="translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="inline-block rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-lg">
                      {photo.label}
                    </span>
                  </div>
                </div>

                {/* Shine effect on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
