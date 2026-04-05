"use client";

import { useRef, useEffect, useState, useCallback } from "react";

import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ToothScene = dynamic(() => import("./ToothScene"), { ssr: false });


export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const animStarted = useRef(false);

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  useEffect(() => {
    if (!sceneReady || animStarted.current) return;
    animStarted.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", force3d: true },
      });

      tl.to(".hero-title", {
        y: 0, opacity: 1, duration: 0.6,
      });

      tl.to(".hero-tooth-wrapper", {
        y: 0, opacity: 1, duration: 0.8,
      }, 0.15);

      tl.fromTo(".hero-cta",
        { y: 25, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, stagger: 0.1, duration: 1, ease: "power2.out" },
        0.7,
      );

      // Glow fades in with tooth, then pulses
      gsap.to(".hero-glow", {
        opacity: 1,
        duration: 0.8,
        ease: "power2.inOut",
        delay: 0.2,
        onComplete: () => {
          gsap.to(".hero-glow", {
            scale: 1.2,
            opacity: 0.7,
            duration: 3.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        },
      });

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

      gsap.to(".hero-tooth-scroll", {
        y: "-55%",
        ease: "none",
        scrollTrigger: {
          ...trigger,
          end: "bottom+=50% top",
        },
      });

      gsap.to(".hero-cta-row", {
        y: "-80%",
        ease: "none",
        scrollTrigger: trigger,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [sceneReady]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative z-10 min-h-screen overflow-hidden"
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



        {/* ── Glow behind tooth ── */}
        <div
          className="hero-glow pointer-events-none absolute left-1/2 top-[68%] z-[1] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "clamp(280px, 50vw, 630px)",
            height: "clamp(160px, 28vw, 360px)",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.54) 40%, transparent 70%)",
            filter: "blur(35px)",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />
        <div
          className="hero-glow pointer-events-none absolute left-1/2 top-[68%] z-[1] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "clamp(400px, 75vw, 990px)",
            height: "clamp(230px, 45vw, 585px)",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(220,235,255,0.68) 0%, rgba(180,210,250,0.32) 45%, transparent 70%)",
            filter: "blur(55px)",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />
        <div
          className="hero-glow pointer-events-none absolute left-1/2 top-[68%] z-[1] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "clamp(500px, 100vw, 1620px)",
            height: "clamp(280px, 60vw, 900px)",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(160,190,240,0.36) 0%, rgba(130,165,220,0.16) 40%, transparent 65%)",
            filter: "blur(80px)",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        />

        {/* ── Subtitle + Title ── */}
        <div
          className="hero-title pointer-events-none absolute inset-x-0 top-[12%] sm:top-[14%] z-[1] flex flex-col items-center select-none px-4"
          style={{ opacity: 0, transform: "translateY(30px)", willChange: "transform, opacity" }}
        >
          <span
            className="hero-subtitle mb-3 sm:mb-5 font-[var(--font-heading)] text-sm font-medium tracking-wide sm:text-lg lg:text-xl"
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
        </div>

        {/* ── 3D Tooth ── */}
        <div
          className="hero-tooth-wrapper pointer-events-none absolute inset-x-0 z-[3] hidden sm:block"
          style={{ top: "25%", bottom: "-45%", opacity: 0, transform: "translateY(5%)", willChange: "transform, opacity" }}
        >
          <div className="hero-tooth-scroll pointer-events-auto h-full w-full">
            <ToothScene onReady={handleSceneReady} />
          </div>
        </div>

        {/* ── Buttons ── */}
        <div className="hero-cta-row pointer-events-none absolute inset-x-0 bottom-[22%] sm:bottom-[30%] z-[4] flex flex-col sm:flex-row items-center justify-center gap-4 sm:justify-between px-4 sm:px-[10%] lg:px-[13%] [&_a]:pointer-events-auto">
          <a
            href="#booking"
            className="hero-cta inline-flex h-14 w-full max-w-[280px] items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 text-base font-medium tracking-[0.08em] text-white/90 hover:border-white/40 hover:bg-white/10 active:scale-[0.97] sm:h-20 sm:w-[320px] sm:max-w-none sm:text-xl"
            style={{ visibility: "hidden" }}
          >
            Записаться на приём
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-white/70" />
          </a>
          <a
            href="#promotions"
            className="hero-cta inline-flex h-14 w-full max-w-[280px] items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 text-base font-medium tracking-[0.08em] text-white/90 hover:border-white/40 hover:bg-white/10 active:scale-[0.97] sm:h-20 sm:w-[320px] sm:max-w-none sm:text-xl"
            style={{ visibility: "hidden" }}
          >
            К акциям
            <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-white/70" />
          </a>
        </div>
      </section>
    </>
  );
}
