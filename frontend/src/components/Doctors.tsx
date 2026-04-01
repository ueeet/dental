"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const doctors = [
  {
    name: "Нигматуллин Марат Хамзаевич",
    initials: "НМ",
    specialty: "Стоматолог-ортопед, директор",
    experience: 12,
    description:
      "Специалист в области ортопедической стоматологии. Руководит клиникой IQ Dental, обеспечивая высочайшие стандарты качества лечения.",
    schedule: "Пн–Пт: 9:00–18:00",
  },
  {
    name: "Шайхелисламов Раушан Рафисович",
    initials: "ШР",
    specialty: "Хирург-имплантолог",
    experience: 15,
    description:
      "Опытный хирург-имплантолог, владеющий современными методиками имплантации и костной пластики.",
    schedule: "Пн–Пт: 9:00–18:00",
  },
  {
    name: "Гумеров Артур Рафаэлевич",
    initials: "ГА",
    specialty: "Стоматолог-ортопед",
    experience: 19,
    description:
      "Один из самых опытных специалистов клиники. Мастер эстетического протезирования и сложных ортопедических конструкций.",
    schedule: "Пн–Пт: 9:00–18:00",
  },
  {
    name: "Нигматуллина Лилия Марселевна",
    initials: "НЛ",
    specialty: "Стоматолог-терапевт",
    experience: 12,
    description:
      "Специализируется на терапевтическом лечении зубов, эндодонтии и эстетической реставрации.",
    schedule: "Пн–Пт: 9:00–18:00",
  },
  {
    name: "Ногманов Фарид Флюрович",
    initials: "НФ",
    specialty: "Хирург-имплантолог",
    experience: 11,
    description:
      "Квалифицированный хирург-имплантолог, специализирующийся на установке дентальных имплантатов и хирургическом лечении.",
    schedule: "Пн–Пт: 9:00–18:00",
  },
  {
    name: "Гараев Альберт Радикович",
    initials: "ГА",
    specialty: "Хирург-имплантолог",
    experience: 9,
    description:
      "Молодой и перспективный хирург-имплантолог, применяющий передовые технологии в имплантации зубов.",
    schedule: "Пн–Пт: 9:00–18:00",
  },
  {
    name: "Бакирова Диляра Фаритовна",
    initials: "БД",
    specialty: "Стоматолог-терапевт",
    experience: 5,
    description:
      "Внимательный и заботливый терапевт, специализирующийся на лечении кариеса и профилактической стоматологии.",
    schedule: "Пн–Пт: 9:00–18:00",
  },
];

export default function Doctors() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-animate='doc-label']", {
        autoAlpha: 0,
        y: 20,
        duration: 0.5,
        scrollTrigger: {
          trigger: "[data-animate='doc-label']",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from("[data-animate='doc-heading']", {
        autoAlpha: 0,
        y: 30,
        duration: 0.6,
        delay: 0.1,
        scrollTrigger: {
          trigger: "[data-animate='doc-heading']",
          start: "top 85%",
          once: true,
        },
      });

      ScrollTrigger.batch("[data-animate='doctor-card']", {
        onEnter: (batch) => {
          gsap.from(batch, {
            autoAlpha: 0,
            y: 50,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
          });
        },
        start: "top 88%",
        once: true,
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      id="doctors"
      ref={containerRef}
      className="py-[var(--space-section)] bg-[var(--background)]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div
          data-animate="doc-label"
          className="mb-3"
          style={{ visibility: "hidden" }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Команда
          </span>
        </div>

        {/* Heading */}
        <div
          data-animate="doc-heading"
          className="mb-[var(--space-lg)]"
          style={{ visibility: "hidden" }}
        >
          <h2 className="text-fluid-h1 font-heading text-foreground">
            Наши специалисты
          </h2>
          <p className="mt-4 text-fluid-body text-muted-foreground max-w-xl">
            Команда профессионалов с многолетним опытом работы
          </p>
        </div>

        {/* Grid — 2 columns for premium large cards */}
        <div className="group-hover-dim grid grid-cols-1 md:grid-cols-2 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.name}
              data-animate="doctor-card"
              className="group"
              style={{ visibility: "hidden" }}
            >
              <div
                className={cn(
                  "bg-white rounded-3xl overflow-hidden",
                  "transition-shadow duration-500 ease-out",
                  "hover:shadow-xl"
                )}
              >
                {/* Photo placeholder — gradient with initials */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600",
                      "flex items-center justify-center",
                      "transition-transform duration-700 ease-out",
                      "group-hover:scale-105"
                    )}
                  >
                    <span className="text-6xl md:text-7xl font-bold text-white/90 select-none">
                      {doctor.initials}
                    </span>
                  </div>
                </div>

                {/* Info section */}
                <div className="p-8">
                  <h3 className="font-heading text-xl md:text-2xl font-semibold text-foreground leading-tight">
                    {doctor.name}
                  </h3>
                  <p className="mt-2 text-primary font-medium text-fluid-body">
                    {doctor.specialty}
                  </p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Опыт {doctor.experience} лет
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
