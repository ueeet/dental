"use client";

import { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const photos = [
  { label: "Ресепшен", img: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=450&fit=crop" },
  { label: "Кабинет терапии", img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&h=800&fit=crop" },
  { label: "Панорамный снимок", img: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&h=450&fit=crop" },
  { label: "Зона ожидания", img: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&h=450&fit=crop" },
  { label: "Хирургический кабинет", img: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&h=800&fit=crop" },
  { label: "Стерилизация", img: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&h=450&fit=crop" },
  { label: "Современное оборудование", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=450&fit=crop" },
  { label: "Улыбка пациента", img: "https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=600&h=800&fit=crop" },
  { label: "Фасад клиники", img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=450&fit=crop" },
];

// Grid positions: 3 rows x 3 cols, all 9 slots filled
const gridPositions = [
  "col-start-1 row-start-1",
  "col-start-2 row-start-1",
  "col-start-3 row-start-1",
  "col-start-1 row-start-2",
  "col-start-2 row-start-2", // center
  "col-start-3 row-start-2",
  "col-start-1 row-start-3",
  "col-start-2 row-start-3",
  "col-start-3 row-start-3", // bottom-right — was missing
];

// Scattered positions: chaotic spread across the entire section
const scatteredState = [
  { x: -350, y: -200, r: -25 },
  { x: 60,   y: -260, r: 18 },
  { x: 380,  y: -180, r: 30 },
  { x: -420, y: 30,   r: -35 },
  { x: 0,    y: 0,    r: 20 },
  { x: 400,  y: -20,  r: -22 },
  { x: -300, y: 220,  r: 28 },
  { x: 80,   y: 280,  r: -15 },
  { x: 360,  y: 200,  r: -32 },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  // Smooth 3D tilt on entire grid following mouse
  useEffect(() => {
    const loop = () => {
      current.current.x += (mouse.current.x - current.current.x) * 0.06;
      current.current.y += (mouse.current.y - current.current.y) * 0.06;

      if (gridRef.current) {
        gridRef.current.style.transform = `
          rotateX(${current.current.y}deg)
          rotateY(${current.current.x}deg)
        `;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouse.current.x = x * 16;
    mouse.current.y = y * -12;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouse.current.x = 0;
    mouse.current.y = 0;
  }, []);

  // Scroll animation: scattered → assembled → scattered
  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const cards = grid.querySelectorAll<HTMLElement>("[data-card]");

    const ctx = gsap.context(() => {
      // Phase 1: start scattered, assemble to grid on scroll in
      cards.forEach((card, i) => {
        const s = scatteredState[i];
        // Set initial scattered state
        gsap.set(card, {
          x: s.x, y: s.y, rotation: s.r, scale: 0.75,
          rotateX: s.r * 1.5, rotateY: s.x * 0.05,
          transformPerspective: 800,
        });

        // Animate to assembled (0,0) — long scrub range for smooth feel
        gsap.to(card, {
          x: 0,
          y: 0,
          rotation: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "center center",
            scrub: 2,
          },
        });
      });

      // Phase 2: after assembled, scatter again as section leaves
      cards.forEach((card, i) => {
        const s = scatteredState[i];
        gsap.to(card, {
          x: -s.x * 0.8,
          y: s.y * 0.9,
          rotation: -s.r * 0.7,
          rotateX: -s.r * 1.2,
          rotateY: -s.x * 0.04,
          scale: 0.75,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "center 30%",
            end: "bottom top",
            scrub: 2,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="bg-white py-32 md:py-44 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Text — above cards layer */}
        <div className="relative z-10 mx-auto max-w-2xl text-center mb-20 lg:mb-28">
          <p className="font-[var(--font-mono)] text-xs font-semibold uppercase tracking-widest text-blue-600">
            О клинике
          </p>
          <h2 className="mt-4 text-fluid-h1 font-[var(--font-heading)] font-bold leading-[1.1] tracking-tight text-gray-900">
            Современная стоматология
            <br className="hidden sm:block" />
            {" "}в&nbsp;центре города
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-600 sm:text-lg max-w-xl mx-auto">
            <p>
              Клиника{" "}
              <span className="font-semibold text-gray-900">IQ&nbsp;Dental</span>{" "}
              переехала по новому адресу —{" "}
              <span className="font-medium text-gray-900">просп.&nbsp;Мира,&nbsp;34</span>.
              Мы создали пространство, где передовые технологии сочетаются
              с&nbsp;комфортной атмосферой.
            </p>
          </div>
        </div>

        {/* 3D Grid with mouse tilt + scroll scatter/assemble */}
        <div className="relative overflow-hidden rounded-3xl py-16 sm:py-20">
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative mx-auto max-w-6xl"
          style={{ perspective: "1200px" }}
        >
          <div
            ref={gridRef}
            className="grid grid-cols-3 gap-3 sm:gap-4"
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform",
              gridTemplateRows: "200px 200px 200px",
            }}
          >
            {photos.map((photo, idx) => (
              <div
                key={idx}
                data-card
                className={`${gridPositions[idx]} will-change-transform`}
              >
                <div className="group relative h-full w-full overflow-hidden rounded-2xl cursor-pointer">
                  <img
                    src={photo.img}
                    alt={photo.label}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />

                  {/* Dark overlay on hover */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Label */}
                  <div className="absolute inset-0 flex items-end p-4">
                    <div className="translate-y-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="inline-block rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-lg">
                        {photo.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
