"use client";

import { useRef } from "react";
import { Award, Users, HeartPulse, Calendar, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { DotPattern } from "@/components/ui/dot-pattern";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BorderBeam } from "@/components/ui/border-beam";
import { ShimmerButton } from "@/components/ui/shimmer-button";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const stats = [
  { icon: Award, value: 15, suffix: "+", label: "лет опыта" },
  { icon: Users, value: 7, suffix: "", label: "врачей" },
  { icon: HeartPulse, value: 10000, suffix: "+", label: "пациентов" },
  { icon: Calendar, value: 0, suffix: "₽", label: "консультация" },
];

const trustItems = [
  "Лицензия",
  "ДМС",
  "Рассрочка 0%",
  "Гарантия 5 лет",
  "Импланты премиум-класса",
  "3D-диагностика",
  "С 2019 года",
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // ── Scroll parallax on content ──
      gsap.to(".hero-content-inner", {
        y: -90,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[var(--background)]"
    >
      {/* ── Floating orbs ── */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="orb-1 absolute -left-40 -top-40 h-[700px] w-[700px] rounded-full bg-primary opacity-[0.04] blur-3xl" />
        <div className="orb-2 absolute -bottom-60 -right-40 h-[800px] w-[800px] rounded-full bg-primary opacity-[0.05] blur-3xl" />
        <div className="orb-3 absolute left-2/3 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#3b4a7a] opacity-[0.03] blur-3xl" />
      </div>

      {/* Dot pattern background */}
      <DotPattern className="absolute inset-0 opacity-[0.3] [mask-image:radial-gradient(700px_circle_at_center,white,transparent)]" />

      {/* ── Content ── */}
      <div className="hero-content-inner relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-6 sm:px-10 lg:px-16">
        {/* Two-column */}
        <div className="flex flex-1 flex-col gap-12 pb-28 pt-32 lg:flex-row lg:items-center lg:gap-16 lg:pb-28 lg:pt-0">
          {/* LEFT — text */}
          <div className="flex flex-col justify-center lg:w-[60%]">
            {/* Badge */}
            <BlurFade delay={0.1}>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <AnimatedShinyText className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em]">
                    Стоматология нового поколения
                  </AnimatedShinyText>
                </div>
              </div>
            </BlurFade>

            {/* Heading */}
            <BlurFade delay={0.2}>
              <h1 className="text-fluid-display font-[var(--font-heading)] font-bold leading-[0.95] tracking-tight text-neutral-900">
                <span className="block">Ваша улыбка —</span>
                <span className="block text-primary">наша забота</span>
              </h1>
            </BlurFade>

            {/* Subtitle */}
            <BlurFade delay={0.3}>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-neutral-900/60">
                Мы переехали! Встречаем вас по новому адресу на{" "}
                <span className="font-medium text-neutral-900">
                  проспекте Мира, 34
                </span>
                . Современное оборудование и уютная атмосфера.
              </p>
            </BlurFade>

            {/* Buttons */}
            <BlurFade delay={0.4}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a href="#booking">
                  <ShimmerButton className="h-14 rounded-full px-8 text-base font-semibold">
                    <Calendar className="mr-2.5 h-5 w-5" />
                    Записаться на приём
                    <ArrowRight className="ml-2.5 h-4 w-4" />
                  </ShimmerButton>
                </a>

                <a
                  href="#about"
                  className={cn(
                    "inline-flex h-14 items-center rounded-full border border-primary/20 px-8",
                    "text-base font-semibold text-primary transition-all duration-300",
                    "hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]"
                  )}
                >
                  Узнать больше
                </a>
              </div>
            </BlurFade>
          </div>

          {/* RIGHT — stats glass card */}
          <div className="flex justify-center lg:w-[40%] lg:justify-end">
            <BlurFade delay={0.5}>
              <div
                className={cn(
                  "liquid-glass-light relative w-full max-w-sm overflow-hidden rounded-3xl p-8",
                  "depth-shadow lg:rotate-1"
                )}
              >
                {/* Card inner orbs */}
                <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary opacity-[0.07] blur-2xl" />
                <div className="pointer-events-none absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-primary opacity-[0.04] blur-2xl" />

                <p className="mb-6 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-neutral-400">
                  В цифрах
                </p>

                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col gap-1.5">
                      <stat.icon className="h-5 w-5 text-primary" />
                      <span className="font-[var(--font-mono)] text-3xl font-bold leading-none text-neutral-900">
                        {stat.value === 0 ? (
                          <>0{stat.suffix}</>
                        ) : (
                          <>
                            <NumberTicker value={stat.value} />
                            {stat.suffix}
                          </>
                        )}
                      </span>
                      <span className="text-sm text-neutral-500">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>

                <BorderBeam />
              </div>
            </BlurFade>
          </div>
        </div>

        {/* ── Bottom marquee ── */}
        <BlurFade delay={0.6}>
          <div className="pb-20">
            <div className="section-line mb-6 h-px w-full bg-neutral-200" />

            <div className="relative overflow-hidden">
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[var(--background)] to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[var(--background)] to-transparent" />

              <div
                className="flex w-max items-center gap-8"
                style={{ animation: "marquee-left 32s linear infinite" }}
              >
                {[...trustItems, ...trustItems].map((item, i) => (
                  <span
                    key={`${item}-${i}`}
                    className="flex shrink-0 items-center gap-2 font-[var(--font-mono)] text-xs uppercase tracking-[0.1em] text-neutral-400"
                  >
                    <span className="h-1 w-1 rounded-full bg-neutral-300" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
