"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Stethoscope, Award, Calendar } from "lucide-react";
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
      gsap.from("[data-animate='heading']", {
        autoAlpha: 0,
        y: 30,
        duration: 0.6,
        scrollTrigger: {
          trigger: "[data-animate='heading']",
          start: "top 80%",
          once: true,
        },
      });

      ScrollTrigger.batch("[data-animate='doctor-card']", {
        onEnter: (batch) => {
          gsap.from(batch, {
            autoAlpha: 0,
            y: 40,
            duration: 0.5,
            stagger: 0.1,
          });
        },
        start: "top 85%",
        once: true,
      });
    },
    { scope: containerRef }
  );

  return (
    <section id="doctors" ref={containerRef} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div
          data-animate="heading"
          className="text-center mb-16"
          style={{ visibility: "hidden" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Наши специалисты
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Команда профессионалов с многолетним опытом
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.name}
              data-animate="doctor-card"
              className="group [perspective:1000px]"
              style={{ visibility: "hidden" }}
            >
              <div
                className={cn(
                  "relative w-full h-[420px] transition-transform duration-700",
                  "[transform-style:preserve-3d]",
                  "group-hover:[transform:rotateY(180deg)]"
                )}
              >
                {/* Front */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl shadow-md",
                    "bg-white border border-gray-100",
                    "flex flex-col items-center justify-center p-6",
                    "[backface-visibility:hidden]"
                  )}
                >
                  {/* Photo placeholder */}
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      {doctor.initials}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 text-center leading-tight mb-2">
                    {doctor.name}
                  </h3>

                  <p className="text-sm text-blue-600 font-medium text-center">
                    {doctor.specialty}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5 text-gray-400 text-xs">
                    <Award className="w-4 h-4" />
                    <span>Опыт {doctor.experience} лет</span>
                  </div>
                </div>

                {/* Back */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-2xl shadow-md",
                    "bg-gradient-to-br from-blue-500 to-blue-700",
                    "flex flex-col items-center justify-center p-6 text-white",
                    "[backface-visibility:hidden] [transform:rotateY(180deg)]"
                  )}
                >
                  <h3 className="text-lg font-semibold text-center leading-tight mb-4">
                    {doctor.name}
                  </h3>

                  <div className="space-y-4 w-full">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 mt-0.5 shrink-0 text-blue-200" />
                      <div>
                        <p className="text-sm font-medium text-blue-100">
                          Опыт работы
                        </p>
                        <p className="text-sm">{doctor.experience} лет</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Stethoscope className="w-5 h-5 mt-0.5 shrink-0 text-blue-200" />
                      <div>
                        <p className="text-sm font-medium text-blue-100">
                          О специалисте
                        </p>
                        <p className="text-sm leading-relaxed">
                          {doctor.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 mt-0.5 shrink-0 text-blue-200" />
                      <div>
                        <p className="text-sm font-medium text-blue-100">
                          График приёма
                        </p>
                        <p className="text-sm">{doctor.schedule}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
