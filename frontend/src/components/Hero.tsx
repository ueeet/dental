"use client";

import {
  Award,
  Users,
  HeartPulse,
  Calendar,
  ArrowRight,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { icon: Award, value: "15+", label: "лет опыта" },
  { icon: Users, value: "7", label: "врачей" },
  { icon: HeartPulse, value: "10K+", label: "пациентов" },
  { icon: Calendar, value: "0₽", label: "консультация" },
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
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-white"
    >

      {/* Content wrapper */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-6 sm:px-10 lg:px-16">
        {/* Two-column asymmetric */}
        <div className="flex flex-1 flex-col gap-12 pt-32 pb-12 lg:flex-row lg:items-center lg:gap-12 lg:pt-0 lg:pb-0">
          {/* LEFT 60% — text */}
          <div className="flex flex-col justify-center lg:w-[60%]">
            {/* Mono badge */}
            <div
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                <Star className="h-3 w-3 fill-current" />
                Стоматология нового поколения
              </span>
            </div>

            {/* Heading — two lines */}
            <h1 className="text-fluid-display font-[var(--font-heading)] font-bold leading-[0.95] tracking-tight text-neutral-900">
              <span
                className="block"
              >
                Ваша улыбка —
              </span>
              <span
                className="block text-[var(--primary,#2563eb)]"
              >
                наша забота
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="mt-8 max-w-md text-lg leading-relaxed text-neutral-900/60"
            >
              Мы переехали! Встречаем вас по новому адресу на{" "}
              <span className="font-medium text-neutral-900">
                проспекте Мира, 34
              </span>
              . Современное оборудование и уютная атмосфера.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#booking"
                className={cn(
                  "group inline-flex h-14 items-center gap-2.5 rounded-full bg-[var(--primary,#2563eb)] px-8",
                  "text-base font-semibold text-white transition-all duration-300",
                  "shadow-lg shadow-blue-600/20",
                  "hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-600/30",
                  "active:scale-[0.98]"
                )}
              >
                <Calendar className="h-5 w-5" />
                Записаться на приём
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>

              <a
                href="#about"
                className={cn(
                  "inline-flex h-14 items-center rounded-full border border-neutral-200 px-8",
                  "text-base font-semibold text-neutral-700 transition-all duration-300",
                  "hover:border-neutral-300 hover:bg-neutral-50",
                  "active:scale-[0.98]"
                )}
              >
                Узнать больше
              </a>
            </div>
          </div>

          {/* RIGHT 40% — floating glassmorphism card */}
          <div className="flex justify-center lg:w-[40%] lg:justify-end">
            <div
              className={cn(
                "glass-card w-full max-w-sm rounded-3xl p-8",
                "border border-white/60 bg-white/40 shadow-2xl shadow-neutral-900/5 backdrop-blur-xl",
                "lg:rotate-1"
              )}
            >
              <p className="mb-6 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-neutral-400">
                В цифрах
              </p>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1.5">
                    <stat.icon className="h-5 w-5 text-[var(--primary,#2563eb)]" />
                    <span className="font-[var(--font-mono)] text-3xl font-bold leading-none text-neutral-900">
                      {stat.value}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Decorative corner accent */}
              <div className="pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 rounded-full bg-[var(--primary,#2563eb)] opacity-[0.08] blur-2xl" />
            </div>
          </div>
        </div>

        {/* Bottom area — divider + marquee */}
        <div className="pb-8">
          {/* Thin line separator */}
          <div
            className="section-line mb-6 h-px w-full origin-left bg-neutral-200"
          />

          {/* Trust marquee */}
          <div
            className="relative overflow-hidden"
          >
            {/* Fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent" />

            <div className="flex w-max items-center gap-8">
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
      </div>
    </section>
  );
}
