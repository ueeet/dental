"use client";

import { useRef, useCallback, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const doctors = [
  {
    name: "Нигматуллин Марат Хамзаевич",
    specialty: "Стоматолог-ортопед, директор",
    experience: 12,
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face",
    description: "Специалист в области ортопедической стоматологии. Руководит клиникой IQ Dental, обеспечивая высочайшие стандарты качества лечения.",
    schedule: "Пн–Пт: 9:00–18:00",
  },
  {
    name: "Шайхелисламов Раушан Рафисович",
    specialty: "Хирург-имплантолог",
    experience: 15,
    photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=500&fit=crop&crop=face",
    description: "Опытный хирург-имплантолог, владеющий современными методиками имплантации и костной пластики.",
    schedule: "Пн–Пт: 9:00–18:00",
  },
  {
    name: "Гумеров Артур Рафаэлевич",
    specialty: "Стоматолог-ортопед",
    experience: 19,
    photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=500&fit=crop&crop=face",
    description: "Один из самых опытных специалистов клиники. Мастер эстетического протезирования и сложных ортопедических конструкций.",
    schedule: "Пн–Пт: 9:00–18:00",
  },
  {
    name: "Нигматуллина Лилия Марселевна",
    specialty: "Стоматолог-терапевт",
    experience: 12,
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=400&h=500&fit=crop&crop=face",
    description: "Специализируется на терапевтическом лечении зубов, эндодонтии и эстетической реставрации.",
    schedule: "Пн–Пт: 9:00–18:00",
  },
  {
    name: "Ногманов Фарид Флюрович",
    specialty: "Хирург-имплантолог",
    experience: 11,
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=500&fit=crop&crop=face",
    description: "Квалифицированный хирург-имплантолог, специализирующийся на установке дентальных имплантатов.",
    schedule: "Пн–Пт: 9:00–18:00",
  },
  {
    name: "Гараев Альберт Радикович",
    specialty: "Хирург-имплантолог",
    experience: 9,
    photo: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=500&fit=crop&crop=face",
    description: "Молодой и перспективный хирург-имплантолог, применяющий передовые технологии в имплантации зубов.",
    schedule: "Пн–Пт: 9:00–18:00",
  },
];

type Doctor = (typeof doctors)[number];

function DoctorCard({ doctor, onClick }: { doctor: Doctor; onClick: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -12;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;

    gsap.to(card, { rotationX: rotateX, rotationY: rotateY, duration: 0.4, ease: "power2.out", transformPerspective: 800 });
    if (glareRef.current) {
      gsap.to(glareRef.current, { opacity: 0.15, x: x - rect.width / 2, y: y - rect.height / 2, duration: 0.4, ease: "power2.out" });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) gsap.to(cardRef.current, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power3.out", transformPerspective: 800 });
    if (glareRef.current) gsap.to(glareRef.current, { opacity: 0, duration: 0.4 });
  }, []);

  return (
    <div
      className="group cursor-pointer"
      style={{ perspective: "800px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div
        ref={cardRef}
        className={cn(
          "relative bg-white rounded-2xl overflow-hidden border border-gray-100 h-full",
          "transition-shadow duration-300 will-change-transform",
          "hover:shadow-2xl hover:shadow-[var(--primary)]/10"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div ref={glareRef} className="pointer-events-none absolute inset-0 z-10 rounded-2xl" style={{ opacity: 0, background: "radial-gradient(300px circle at center, rgba(255,255,255,0.8), transparent 60%)" }} />

        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <img src={doctor.photo} alt={doctor.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
        </div>

        <div className="p-6">
          <h3 className="font-[var(--font-heading)] text-lg font-semibold text-foreground leading-snug">{doctor.name}</h3>
          <p className="mt-2 text-sm font-medium text-[var(--primary)]">{doctor.specialty}</p>
          <p className="mt-2.5 font-[var(--font-mono)] text-xs uppercase tracking-[0.15em] text-muted-foreground">Опыт {doctor.experience} лет</p>
        </div>
      </div>
    </div>
  );
}

/* ---- Modal with 3D tilt ---- */
function DoctorModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, { rotationX: y * -10, rotationY: x * 10, duration: 0.4, ease: "power2.out", transformPerspective: 1000 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) gsap.to(cardRef.current, { rotationX: 0, rotationY: 0, duration: 0.6, ease: "power3.out", transformPerspective: 1000 });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
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
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row overflow-hidden rounded-3xl">
            {/* Photo */}
            <div className="relative sm:w-2/5 shrink-0">
              <div className="overflow-hidden rounded-2xl m-4 sm:m-5 sm:mr-0" style={{ aspectRatio: "3/4" }}>
                <img src={doctor.photo} alt={doctor.name} className="h-full w-full object-cover" />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center p-8 sm:p-10">
              <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.15em] text-muted-foreground">Специалист</p>
              <h3 className="mt-3 font-[var(--font-heading)] text-2xl font-bold text-foreground leading-tight">{doctor.name}</h3>
              <p className="mt-3 text-lg font-medium text-[var(--primary)]">{doctor.specialty}</p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">{doctor.description}</p>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="rounded-xl bg-[var(--muted)] px-4 py-2.5">
                  <p className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-muted-foreground">Опыт</p>
                  <p className="font-[var(--font-heading)] text-lg font-bold text-foreground">{doctor.experience} лет</p>
                </div>
                <div className="rounded-xl bg-[var(--muted)] px-4 py-2.5">
                  <p className="font-[var(--font-mono)] text-xs uppercase tracking-wider text-muted-foreground">График</p>
                  <p className="font-[var(--font-heading)] text-lg font-bold text-foreground">{doctor.schedule}</p>
                </div>
              </div>

              <a
                href="#booking"
                onClick={onClose}
                className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-[var(--primary)] px-8 text-sm font-semibold text-white transition-all hover:bg-[#353d5c] active:scale-[0.98]"
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

  return (
    <>
      <section id="doctors" className="py-[var(--space-section)] bg-[var(--background)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-3">
            <span className="font-[var(--font-mono)] text-xs uppercase tracking-[0.2em] text-muted-foreground">Команда</span>
          </div>
          <div className="mb-[var(--space-lg)]">
            <h2 className="text-fluid-h1 font-[var(--font-heading)] text-foreground">Наши специалисты</h2>
            <p className="mt-4 text-fluid-body text-muted-foreground max-w-xl">Команда профессионалов с многолетним опытом работы</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.name} doctor={doctor} onClick={() => setSelectedDoctor(doctor)} />
            ))}
          </div>
        </div>
      </section>

      {selectedDoctor && (
        <DoctorModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
      )}
    </>
  );
}
