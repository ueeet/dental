"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const animStarted = useRef(false);

  useEffect(() => {
    if (animStarted.current) return;
    animStarted.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", force3d: true },
        delay: 0.3,
      });

      tl.to(".hero-title", {
        y: 0, opacity: 1, duration: 0.6,
      });

      tl.fromTo(".hero-cta",
        { y: 25, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.1, duration: 1, ease: "power2.out" },
        0.5,
      );

      /* ── Parallax on scroll ── */
      const trigger = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      };

      gsap.to(".hero-title", {
        y: "-25%",
        ease: "none",
        scrollTrigger: trigger,
      });

      gsap.to(".hero-cta-row", {
        y: "-80%",
        ease: "none",
        scrollTrigger: trigger,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-[2] min-h-screen"
      style={{ backgroundColor: "transparent" }}
    >
      {/* ── Ambient light overlays ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at 50% 35%, rgba(120,150,200,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 25% 70%, rgba(80,100,160,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 80% 20%, rgba(100,130,180,0.06) 0%, transparent 50%)
          `,
        }}
      />

      {/* ── Content: centered on mobile, absolute on desktop ── */}
      <div
        className="hero-title relative z-[1] flex min-h-screen flex-col items-center justify-center px-6 sm:pointer-events-none sm:absolute sm:inset-x-0 sm:top-[10%] md:top-[12%] lg:top-[14%] sm:min-h-0 sm:px-4"
        style={{ opacity: 0, transform: "translateY(30px)", willChange: "transform, opacity" }}
      >
        <span
          className="hero-subtitle mb-2 sm:mb-5 font-[var(--font-heading)] text-xs font-medium tracking-wide sm:text-lg lg:text-xl"
          style={{ color: "rgba(220, 225, 240, 0.5)" }}
        >
          Стоматология нового поколения
        </span>
        <h1
          className="text-center font-[var(--font-heading)] font-bold uppercase leading-[1.1]"
          style={{
            fontSize: "clamp(2.5rem, 12vw, 14rem)",
            letterSpacing: "-0.04em",
            background: "linear-gradient(180deg, rgba(230,235,250,0.7) 0%, rgba(160,175,210,0.35) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
            filter: "drop-shadow(0 0 60px rgba(150,170,220,0.2))",
          }}
        >
          Айкью Дентал
        </h1>

        {/* Mobile buttons — right below title */}
        <div className="mt-8 flex w-full flex-col items-center gap-3 sm:hidden [&_a]:pointer-events-auto">
          <a
            href="#booking"
            className="hero-cta inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 text-base font-medium tracking-[0.08em] text-white/90 active:scale-[0.97]"
            style={{ visibility: "hidden" }}
          >
            Записаться на приём
            <ArrowRight className="h-5 w-5 text-white/70" />
          </a>
          <a
            href="#promotions"
            className="hero-cta inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 text-base font-medium tracking-[0.08em] text-white/90 active:scale-[0.97]"
            style={{ visibility: "hidden" }}
          >
            К акциям
            <ArrowRight className="h-5 w-5 text-white/70" />
          </a>
        </div>
      </div>

      {/* ── Desktop buttons (absolute) ── */}
      <div className="hero-cta-row pointer-events-none absolute inset-x-0 bottom-[22%] sm:bottom-[20%] md:bottom-[25%] lg:bottom-[30%] z-[4] hidden sm:flex items-center justify-between px-[8%] md:px-[10%] lg:px-[13%] [&_a]:pointer-events-auto">
        <a
          href="#booking"
          className="hero-cta inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 font-medium tracking-[0.08em] text-white/90 hover:border-white/40 hover:bg-white/10 active:scale-[0.97] h-14 w-[240px] text-base md:h-16 md:w-[280px] md:text-lg lg:h-20 lg:w-[320px] lg:text-xl"
          style={{ visibility: "hidden" }}
        >
          Записаться на приём
          <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6 text-white/70" />
        </a>
        <a
          href="#promotions"
          className="hero-cta inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 font-medium tracking-[0.08em] text-white/90 hover:border-white/40 hover:bg-white/10 active:scale-[0.97] h-14 w-[240px] text-base md:h-16 md:w-[280px] md:text-lg lg:h-20 lg:w-[320px] lg:text-xl"
          style={{ visibility: "hidden" }}
        >
          К акциям
          <ArrowRight className="h-5 w-5 lg:h-6 lg:w-6 text-white/70" />
        </a>
      </div>
    </section>
  );
}
