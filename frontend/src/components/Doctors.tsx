"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

const doctors = [
  {
    name: "Нигматуллин Марат Хамзаевич",
    initials: "НМ",
    specialty: "Стоматолог-ортопед, директор",
    experience: 12,
  },
  {
    name: "Шайхелисламов Раушан Рафисович",
    initials: "ШР",
    specialty: "Хирург-имплантолог",
    experience: 15,
  },
  {
    name: "Гумеров Артур Рафаэлевич",
    initials: "ГА",
    specialty: "Стоматолог-ортопед",
    experience: 19,
  },
  {
    name: "Нигматуллина Лилия Марселевна",
    initials: "НЛ",
    specialty: "Стоматолог-терапевт",
    experience: 12,
  },
  {
    name: "Ногманов Фарид Флюрович",
    initials: "НФ",
    specialty: "Хирург-имплантолог",
    experience: 11,
  },
  {
    name: "Гараев Альберт Радикович",
    initials: "ГА",
    specialty: "Хирург-имплантолог",
    experience: 9,
  },
];

function DoctorCard({ doctor }: { doctor: (typeof doctors)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    gsap.to(card, {
      rotationX: rotateX,
      rotationY: rotateY,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });

    if (glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 0.15,
        x: x - rect.width / 2,
        y: y - rect.height / 2,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.6,
      ease: "power3.out",
      transformPerspective: 800,
    });
    if (glareRef.current) {
      gsap.to(glareRef.current, { opacity: 0, duration: 0.4 });
    }
  }, []);

  return (
    <div
      className="group"
      style={{ perspective: "800px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className={cn(
          "relative bg-white rounded-2xl overflow-hidden border border-gray-100",
          "transition-shadow duration-300 will-change-transform",
          "hover:shadow-2xl hover:shadow-blue-500/10"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Glare effect */}
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
          style={{
            opacity: 0,
            background:
              "radial-gradient(300px circle at center, rgba(255,255,255,0.8), transparent 60%)",
          }}
        />

        {/* Photo placeholder */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700",
              "flex items-center justify-center",
              "transition-transform duration-700 ease-out",
              "group-hover:scale-110"
            )}
          >
            <span className="text-4xl sm:text-5xl font-bold text-white/80 select-none tracking-wider">
              {doctor.initials}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="font-[var(--font-heading)] text-lg font-semibold text-foreground leading-snug">
            {doctor.name}
          </h3>
          <p className="mt-2 text-sm font-medium text-primary">
            {doctor.specialty}
          </p>
          <p className="mt-2.5 font-[var(--font-mono)] text-xs uppercase tracking-[0.15em] text-muted-foreground">
            Опыт {doctor.experience} лет
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Doctors() {
  return (
    <section
      id="doctors"
      className="py-[var(--space-section)] bg-[var(--background)]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="mb-3">
          <span className="font-[var(--font-mono)] text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Команда
          </span>
        </div>

        {/* Heading */}
        <div className="mb-[var(--space-lg)]">
          <h2 className="text-fluid-h1 font-[var(--font-heading)] text-foreground">
            Наши специалисты
          </h2>
          <p className="mt-4 text-fluid-body text-muted-foreground max-w-xl">
            Команда профессионалов с многолетним опытом работы
          </p>
        </div>

        {/* Grid — 3 cols desktop, 2 tablet, 1 mobile */}
        <div className="group-hover-dim grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.name} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}
