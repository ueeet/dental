"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ToothScene = dynamic(() => import("./ToothScene"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.15,
      });

      tl.to(".hero-bg-text", {
        y: 0, opacity: 1, duration: 0.8,
      });

      tl.to(".hero-tooth-wrapper", {
        y: 0, opacity: 1, duration: 1.6, ease: "power2.out",
      }, 0.1);

      tl.to(".hero-cta", {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.5,
      }, "-=1.0");

      gsap.to(".hero-tooth-scroll", {
        y: "-55%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom+=50% top",
          scrub: 1.5,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <>
      <section
        ref={sectionRef}
        className="relative min-h-screen"
        style={{
          backgroundColor: "#2a3040",
          backgroundImage:
            "linear-gradient(to bottom, #ffffff 0%, #e4e8f0 25%, #b0b8c8 50%, #4a5268 80%, #2a3040 100%)",
        }}
      >
        {/* ── "Стоматология нового поколения" + АЙКЬЮ ДЕНТАЛ ── */}
        <div
          className="hero-bg-text pointer-events-none absolute inset-x-0 top-[22%] z-[1] flex flex-col items-center select-none"
          style={{ opacity: 0, transform: "translateY(60px)" }}
        >
          <span className="mb-4 font-[var(--font-mono)] text-sm tracking-[0.15em] text-[#2a3250]/50">
            Стоматология нового поколения
          </span>
          <h1
            className="whitespace-nowrap font-[var(--font-heading)] font-bold uppercase leading-none"
            style={{
              fontSize: "clamp(4rem, 12vw, 14rem)",
              letterSpacing: "-0.04em",
              color: "rgba(42, 50, 80, 0.55)",
            }}
          >
            Айкью Дентал
          </h1>
        </div>

        {/* ── 3D Tooth ── */}
        <div
          className="hero-tooth-wrapper pointer-events-none absolute inset-x-0 z-[2]"
          style={{ top: "30%", bottom: "-45%", opacity: 0, transform: "translateY(15%)" }}
        >
          <div className="hero-tooth-scroll pointer-events-auto h-full w-full">
            <ToothScene />
          </div>
        </div>

        {/* ── Buttons ── */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[24%] z-[3] flex items-center justify-between px-[12%] sm:px-[15%] lg:px-[18%] [&_a]:pointer-events-auto">
          <a
            href="#booking"
            className="hero-cta inline-flex h-16 w-64 items-center justify-center gap-3 rounded-full bg-[#2a3250] text-lg font-semibold tracking-[0.02em] text-white transition-all hover:bg-[#1d2440] active:scale-[0.97]"
            style={{ opacity: 0, transform: "translateY(20px)" }}
          >
            Записаться на приём
          </a>
          <a
            href="#about"
            className="hero-cta inline-flex h-16 w-64 items-center justify-center gap-3 rounded-full bg-white/90 text-lg font-semibold tracking-[0.02em] text-[#2a3250] transition-all hover:bg-white active:scale-[0.97]"
            style={{ opacity: 0, transform: "translateY(20px)" }}
          >
            Подробнее
          </a>
        </div>
      </section>
    </>
  );
}
