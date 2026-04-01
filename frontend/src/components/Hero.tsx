"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Calendar,
  Users,
  Award,
  HeartPulse,
  Star,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stats = [
  { icon: Award, label: "15+ лет опыта", value: "15+" },
  { icon: Users, label: "7 специалистов", value: "7" },
  { icon: HeartPulse, label: "10 000+ пациентов", value: "10K+" },
  { icon: Calendar, label: "Бесплатная консультация", value: "0\u20BD" },
];

const trustedBrands = [
  "Straumann",
  "Nobel Biocare",
  "Invisalign",
  "3M",
  "Dentsply Sirona",
  "Ivoclar",
  "GC Corporation",
  "VITA",
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Entrance animations with stagger
      gsap.from("[data-hero-badge]", {
        autoAlpha: 0,
        y: 30,
        duration: 0.7,
        ease: "power2.out",
      });

      gsap.from("[data-hero-heading]", {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        delay: 0.15,
        ease: "power2.out",
      });

      gsap.from("[data-hero-subtitle]", {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
      });

      gsap.from("[data-hero-buttons]", {
        autoAlpha: 0,
        y: 40,
        duration: 0.8,
        delay: 0.45,
        ease: "power2.out",
      });

      gsap.from("[data-hero-stat]", {
        autoAlpha: 0,
        y: 30,
        duration: 0.6,
        delay: 0.6,
        stagger: 0.1,
        ease: "power2.out",
      });

      gsap.from("[data-hero-trust]", {
        autoAlpha: 0,
        duration: 0.8,
        delay: 1.0,
        ease: "power2.out",
      });

      gsap.from("[data-hero-marquee]", {
        autoAlpha: 0,
        duration: 0.8,
        delay: 1.2,
        ease: "power2.out",
      });

      // Marquee infinite scroll animation
      const marqueeInner = marqueeRef.current;
      if (marqueeInner) {
        const marqueeWidth = marqueeInner.scrollWidth / 2;
        gsap.to(marqueeInner, {
          x: -marqueeWidth,
          duration: 25,
          ease: "none",
          repeat: -1,
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950"
    >
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0.05) 40%, transparent 70%)",
        }}
      />

      {/* Decorative blurred circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[450px] w-[450px] rounded-full bg-blue-500/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-blue-400/5 blur-3xl" />
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(96,165,250,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div data-hero-badge style={{ visibility: "hidden" }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-white/5 px-5 py-2 text-sm font-medium text-blue-300 shadow-sm backdrop-blur-md">
              <Star className="h-3.5 w-3.5 fill-blue-400 text-blue-400" />
              Стоматология нового поколения
            </span>
          </div>

          {/* Heading */}
          <h1
            data-hero-heading
            style={{ visibility: "hidden" }}
            className="font-heading mt-8 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Ваша улыбка —{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              наша забота
            </span>
          </h1>

          {/* Subtitle */}
          <p
            data-hero-subtitle
            style={{ visibility: "hidden" }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl"
          >
            Мы переехали! Встречаем вас по новому адресу на{" "}
            <span className="font-semibold text-white">
              проспекте Мира, 34
            </span>
          </p>

          {/* Buttons */}
          <div
            data-hero-buttons
            style={{ visibility: "hidden" }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <a
              href="#booking"
              className={cn(
                "group inline-flex h-14 items-center justify-center gap-2 rounded-full px-8 text-base font-semibold transition-all duration-300",
                "bg-blue-600 text-white shadow-lg shadow-blue-600/25",
                "hover:scale-105 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30",
                "active:scale-[0.98]"
              )}
            >
              <Calendar className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              Записаться на приём
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#about"
              className={cn(
                "inline-flex h-14 items-center justify-center rounded-full px-8 text-base font-semibold transition-all duration-300",
                "border border-white/10 bg-white/5 text-white backdrop-blur-md",
                "hover:border-blue-500/30 hover:bg-white/10 hover:shadow-md",
                "active:scale-[0.98]"
              )}
            >
              Узнать больше
            </a>
          </div>

          {/* Stats row — glassmorphism cards */}
          <div className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                data-hero-stat
                style={{ visibility: "hidden" }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl p-5 transition-all duration-300",
                  "border border-white/10 bg-white/5 backdrop-blur-md",
                  "hover:border-blue-500/20 hover:bg-white/10 hover:shadow-lg hover:shadow-blue-500/5"
                )}
              >
                <stat.icon className="h-6 w-6 text-blue-400" />
                <span className="text-center text-sm font-medium text-zinc-200">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div
            data-hero-trust
            style={{ visibility: "hidden" }}
            className="mt-10 flex flex-col items-center gap-2 text-xs text-zinc-500 sm:flex-row sm:gap-4"
          >
            <span className="inline-flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" />
              Лицензия ЛО-77-01-020835
            </span>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <span>Работаем с 2019 года</span>
          </div>

          {/* Marquee — trusted brands */}
          <div
            data-hero-marquee
            style={{ visibility: "hidden" }}
            className="mt-12 w-full max-w-3xl overflow-hidden"
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-600">
              Работаем с ведущими производителями
            </p>
            <div className="relative">
              {/* Fade edges */}
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-zinc-950 to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-zinc-950 to-transparent" />

              <div ref={marqueeRef} className="flex w-max gap-8">
                {/* Duplicate items for seamless loop */}
                {[...trustedBrands, ...trustedBrands].map((brand, i) => (
                  <span
                    key={`${brand}-${i}`}
                    className="flex-shrink-0 rounded-lg border border-white/5 bg-white/5 px-5 py-2 text-sm text-zinc-400 backdrop-blur-sm"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
