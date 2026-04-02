"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { api } from "@/lib/api";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  photo: string | null;
  description: string | null;
  schedule: Record<string, { start: string; end: string }> | null;
}

function DoctorCard({
  doctor,
  onClick,
}: {
  doctor: Doctor;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const border = borderRef.current;
      if (!border) return;
      const rect = border.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -12;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;

      gsap.to(border, {
        rotationX: rotateX,
        rotationY: rotateY,
        scale: 1.06,
        zIndex: 10,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 800,
      });

      border.style.backgroundImage = `radial-gradient(400px circle at ${x}px ${y}px, rgba(42,50,80,0.8), rgba(42,50,80,0.15) 50%, transparent 70%)`;

      if (glareRef.current) {
        gsap.to(glareRef.current, {
          opacity: 0.12,
          x: x - rect.width / 2,
          y: y - rect.height / 2,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    if (borderRef.current) {
      gsap.to(borderRef.current, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        zIndex: 1,
        duration: 0.6,
        ease: "power3.out",
        transformPerspective: 800,
      });
      borderRef.current.style.backgroundImage = "none";
      borderRef.current.style.backgroundColor = "rgba(42,50,80,0.12)";
    }
    if (glareRef.current)
      gsap.to(glareRef.current, { opacity: 0, duration: 0.4 });
  }, []);

  return (
    <div
      className="doctor-card group relative h-full cursor-pointer"
      style={{ perspective: "800px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div
        ref={borderRef}
        className="h-full rounded-2xl p-[1.5px] will-change-transform"
        style={{
          background: "rgba(42,50,80,0.12)",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          ref={cardRef}
          className={cn(
            "relative h-full overflow-hidden rounded-[14px] bg-white",
            "transition-shadow duration-300",
            "hover:shadow-2xl hover:shadow-primary/10"
          )}
        >
          <div
            ref={glareRef}
            className="pointer-events-none absolute inset-0 z-10 rounded-[14px]"
            style={{
              opacity: 0,
              background:
                "radial-gradient(300px circle at center, rgba(255,255,255,0.8), transparent 60%)",
            }}
          />

          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: "3/4" }}
          >
            <img
              src={doctor.photo}
              alt={doctor.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
            />
            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>

          <div className="p-6">
            <h3 className="font-[var(--font-heading)] text-lg font-semibold leading-snug text-foreground">
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
    </div>
  );
}

function DoctorModal({
  doctor,
  onClose,
}: {
  doctor: Doctor;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotationX: y * -10,
        rotationY: x * 10,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current)
      gsap.to(cardRef.current, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: "power3.out",
        transformPerspective: 1000,
      });
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-2xl"
        style={{ perspective: "1000px" }}
        onClick={(e) => e.stopPropagation()}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl bg-white shadow-2xl will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col overflow-hidden rounded-3xl sm:flex-row">
            <div className="relative shrink-0 sm:w-2/5">
              <div
                className="m-4 overflow-hidden rounded-2xl sm:m-5 sm:mr-0"
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-10">
              <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.15em] text-muted-foreground">
                Специалист
              </p>
              <h3 className="mt-3 font-[var(--font-heading)] text-2xl font-bold leading-tight text-foreground">
                {doctor.name}
              </h3>
              <p className="mt-3 text-lg font-medium text-primary">
                {doctor.specialty}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {doctor.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="rounded-xl bg-muted px-4 py-2.5">
                  <p className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-muted-foreground">
                    Опыт
                  </p>
                  <p className="font-[var(--font-heading)] text-lg font-bold text-foreground">
                    {doctor.experience} лет
                  </p>
                </div>
                {doctor.schedule && (
                <div className="rounded-xl bg-muted px-4 py-2.5">
                  <p className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-muted-foreground">
                    График
                  </p>
                  <p className="font-[var(--font-heading)] text-sm font-bold text-foreground">
                    {Object.keys(doctor.schedule).map(d => d.slice(0,2).toUpperCase()).join(", ")}
                  </p>
                </div>
                )}
              </div>

              <a
                href="#booking"
                onClick={onClose}
                className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-white transition-all hover:bg-[#353d5c] active:scale-[0.98]"
              >
                Записаться к специалисту
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Doctors() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    api.get<Doctor[]>("/doctors").then(setDoctors).catch(console.error);
  }, []);

  useGSAP(
    () => {
      // Heading reveal
      gsap.from(".doctors-heading", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".doctors-heading",
          start: "top 88%",
          once: true,
        },
      });

      // Cards stagger entrance
      gsap.from(".doctor-card", {
        y: 60,
        opacity: 0,
        scale: 0.93,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".doctors-grid",
          start: "top 85%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <>
      <section
        ref={sectionRef}
        id="doctors"
        className="relative bg-background pb-28 pt-16 sm:pt-20"
      >
        {/* Subtle orb */}
        <div
          className="pointer-events-none absolute left-0 top-1/3 h-96 w-96 rounded-full bg-primary/4 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="doctors-heading mb-[var(--space-lg)]">
            <div className="mb-3">
              <span className="font-[var(--font-mono)] text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Команда
              </span>
            </div>
            <h2 className="text-fluid-h1 font-[var(--font-heading)] text-foreground">
              Наши специалисты
            </h2>
            <p className="mt-4 max-w-xl text-fluid-body text-muted-foreground">
              Команда профессионалов с многолетним опытом работы
            </p>
          </div>

          <div className="doctors-grid grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.name}
                doctor={doctor}
                onClick={() => setSelectedDoctor(doctor)}
              />
            ))}
          </div>
        </div>

        {/* Wave → Reviews (very dark) */}
      </section>

      {selectedDoctor && (
        <DoctorModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </>
  );
}
