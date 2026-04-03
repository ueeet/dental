"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Clock, Shield, Sparkles } from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Using `to` + inline opacity:0 for reliability (same pattern as Hero)
      gsap.to(".about-text-item", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-left",
          start: "top 80%",
          once: true,
        },
      });

      gsap.to(".about-photo", {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".about-grid",
          start: "top 80%",
          once: true,
        },
      });

      // Hover — push siblings horizontally (flex-grow) AND vertically (row flex-grow)
      const allRows = gsap.utils.toArray<HTMLElement>(".about-photo-grid");
      allRows.forEach((row) => {
        const cards = gsap.utils.toArray<HTMLElement>(".about-photo", row);
        const otherRows = allRows.filter((r) => r !== row);

        cards.forEach((card) => {
          card.addEventListener("mouseenter", () => {
            // Horizontal: grow hovered card, shrink siblings
            gsap.to(card, { flexGrow: 2.2, duration: 0.5, ease: "power2.out" });
            cards.forEach((sibling) => {
              if (sibling !== card) {
                gsap.to(sibling, { flexGrow: 0.5, duration: 0.5, ease: "power2.out" });
              }
            });
            // Vertical: grow this row, shrink other rows
            gsap.to(row, { flexGrow: 1.8, duration: 0.5, ease: "power2.out" });
            otherRows.forEach((r) => {
              gsap.to(r, { flexGrow: 0.5, duration: 0.5, ease: "power2.out" });
            });
          });

          card.addEventListener("mouseleave", () => {
            // Reset all cards in this row
            cards.forEach((c) => {
              gsap.to(c, { flexGrow: 1, duration: 0.5, ease: "power2.out" });
            });
            // Reset all rows
            allRows.forEach((r) => {
              gsap.to(r, { flexGrow: 1, duration: 0.5, ease: "power2.out" });
            });
          });
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden pt-0 min-h-screen"
      style={{ background: "linear-gradient(to bottom, #2a3040 0%, #272d3b 8%, #242a37 16%, #222833 25%, #1f2430 40%, #1d2129 55%, #1a1f2e 70%, #1a1f2e 100%)" }}
    >
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 pt-40 sm:px-10 sm:pt-52 lg:px-12 lg:pt-48">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-10">
          {/* ── Left — Info ── */}
          <div className="about-left lg:w-[28%] shrink-0">
            <p
              className="about-text-item font-[var(--font-mono)] text-xs font-semibold uppercase tracking-widest text-white/60"
              style={{ opacity: 0, transform: "translateY(30px)" }}
            >
              О клинике
            </p>

            <h2
              className="about-text-item mt-4 font-[var(--font-heading)] text-fluid-h1 font-bold leading-[1.1] text-white"
              style={{ opacity: 0, transform: "translateY(30px)", letterSpacing: "-0.03em" }}
            >
              Современная стоматология
              <br className="hidden sm:block" /> в&nbsp;центре города
            </h2>

            <p
              className="about-text-item mt-6 max-w-lg text-lg leading-relaxed text-white/80"
              style={{ opacity: 0, transform: "translateY(30px)" }}
            >
              Клиника{" "}
              <span className="font-semibold text-white">IQ&nbsp;Dental</span>{" "}
              переехала по новому адресу —{" "}
              <span className="font-medium text-white">просп.&nbsp;Мира,&nbsp;34</span>.
              Мы создали пространство, где передовые технологии сочетаются
              с&nbsp;комфортной атмосферой.
            </p>

            {/* Features */}
            <div
              className="about-text-item mt-8 grid grid-cols-2 gap-4"
              style={{ opacity: 0, transform: "translateY(30px)" }}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Новый адрес</p>
                  <p className="text-sm text-white/60">просп. Мира, 34</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Работаем</p>
                  <p className="text-sm text-white/60">Пн-Пт 8:00–20:00</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Гарантия</p>
                  <p className="text-sm text-white/60">5 лет на работы</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Технологии</p>
                  <p className="text-sm text-white/60">3D-диагностика</p>
                </div>
              </div>
            </div>

            <a
              href="#services"
              className="about-text-item mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-8 text-sm font-semibold tracking-[0.02em] text-[#1a1f2e] transition-all duration-300 hover:scale-[1.03] hover:bg-white/90 active:scale-[0.98]"
              style={{ opacity: 0, transform: "translateY(30px)" }}
            >
              Узнать об услугах
            </a>
          </div>

          {/* ── Right — 6 Photo cards ── */}
          <div className="about-grid flex-1 lg:translate-x-4 flex flex-col gap-5">
            {/* Row 1 */}
            <div className="about-photo-grid flex flex-1 gap-5">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="about-photo cursor-pointer overflow-hidden rounded-2xl bg-white/10"
                  style={{ opacity: 0, transform: "translateY(40px)", flexGrow: 1, flexBasis: 0 }}
                >
                  <img
                    src={`/about/${n}.png`}
                    alt={`Фото клиники ${n}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Row 2 */}
            <div className="about-photo-grid flex flex-1 gap-5">
              {[4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="about-photo cursor-pointer overflow-hidden rounded-2xl bg-white/10"
                  style={{ opacity: 0, transform: "translateY(40px)", flexGrow: 1, flexBasis: 0 }}
                >
                  <img
                    src={`/about/${n}.png`}
                    alt={`Фото клиники ${n}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
