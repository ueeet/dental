"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ApiService {
  id: number;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string | null;
  isActive: boolean;
}

interface Service {
  id: number;
  category: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  details: string;
}

const FALLBACK_SERVICES: Service[] = [
  {
    id: 1,
    category: "Терапия",
    name: "Лечение кариеса",
    description:
      "Современное лечение кариеса любой сложности с использованием качественных пломбировочных материалов.",
    price: "от 3 840 ₽",
    duration: "60 мин",
    details:
      "Включает анестезию, удаление поражённых тканей, установку светоотверждаемой пломбы и полировку. Используем материалы премиум-класса для долговечного результата.",
  },
  {
    id: 2,
    category: "Терапия",
    name: "Лечение пульпита",
    description:
      "Эндодонтическое лечение каналов зуба с применением современного оборудования и материалов.",
    price: "от 5 500 ₽",
    duration: "90 мин",
    details:
      "Проводится под контролем апекслокатора. Включает механическую и медикаментозную обработку каналов, пломбирование гуттаперчей и реставрацию коронковой части.",
  },
  {
    id: 3,
    category: "Хирургия",
    name: "Удаление зуба",
    description:
      "Простое и сложное удаление зубов, включая зубы мудрости, с минимальным дискомфортом.",
    price: "от 2 000 ₽",
    duration: "30–60 мин",
    details:
      "Проводится под качественной анестезией. При сложном удалении используются атравматичные методики для минимизации послеоперационных осложнений.",
  },
  {
    id: 4,
    category: "Хирургия",
    name: "Имплантация",
    description:
      "Установка дентальных имплантатов ведущих мировых производителей для восстановления зубного ряда.",
    price: "от 21 900 ₽",
    duration: "60–90 мин",
    details:
      "Работаем с имплантатами Straumann, Osstem, Astra Tech. Включает хирургический этап установки, формирователь десны. Протезирование оплачивается отдельно.",
  },
  {
    id: 5,
    category: "Хирургия",
    name: "Синус-лифтинг",
    description:
      "Операция по наращиванию костной ткани верхней челюсти для последующей имплантации.",
    price: "от 5 000 ₽",
    duration: "60–120 мин",
    details:
      "Открытый и закрытый синус-лифтинг. Используем качественные костнозамещающие материалы. Возможно одномоментное проведение с имплантацией.",
  },
  {
    id: 6,
    category: "Ортопедия",
    name: "Коронки",
    description:
      "Металлокерамические и безметалловые коронки для восстановления формы и функции зубов.",
    price: "от 9 000 ₽",
    duration: "2–3 визита",
    details:
      "Коронки из диоксида циркония, E-max, металлокерамики. Цифровое сканирование для точного прилегания.",
  },
  {
    id: 7,
    category: "Ортопедия",
    name: "Виниры",
    description: "Тонкие керамические накладки для идеальной улыбки.",
    price: "от 38 500 ₽",
    duration: "2–3 визита",
    details:
      "Керамические виниры E-max с минимальной обточкой зуба. Индивидуальное моделирование с помощью Digital Smile Design.",
  },
  {
    id: 8,
    category: "Ортопедия",
    name: "Протезирование",
    description:
      "Съёмное и несъёмное протезирование для полного восстановления жевательной функции.",
    price: "от 18 000 ₽",
    duration: "3–5 визитов",
    details:
      "Бюгельные, нейлоновые, акриловые протезы. Протезирование на имплантатах по системе All-on-4 / All-on-6.",
  },
  {
    id: 9,
    category: "Гигиена",
    name: "Профессиональная чистка",
    description: "Комплексная гигиена полости рта.",
    price: "5 700 ₽",
    duration: "60 мин",
    details:
      "Снятие зубного камня ультразвуком, удаление налёта аппаратом Air-Flow, полировка, фторирование.",
  },
  {
    id: 10,
    category: "Гигиена",
    name: "Отбеливание",
    description: "Профессиональное отбеливание зубов.",
    price: "от 12 000 ₽",
    duration: "60–90 мин",
    details:
      "Кабинетное отбеливание системой ZOOM или Beyond. Осветление до 8 тонов за один сеанс.",
  },
  {
    id: 11,
    category: "Эстетика",
    name: "Реставрация зубов",
    description: "Художественная реставрация для восстановления эстетики.",
    price: "от 4 400 ₽",
    duration: "60–90 мин",
    details:
      "Прямая реставрация композитными материалами премиум-класса. Восстановление анатомической формы.",
  },
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState<string>("Все");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const detailsRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    api.get<ApiService[]>("/services").then((data) => {
      const mapped = data.map((s) => ({
        id: s.id,
        category: s.category || "Другое",
        name: s.name,
        description: s.description || "",
        price: `от ${s.price.toLocaleString("ru-RU")} ₽`,
        duration: `${s.duration} мин`,
        details: s.description || "",
      }));
      if (mapped.length > 0) {
        setServices(mapped);
        setCategories([...new Set(mapped.map((s) => s.category))]);
      } else {
        setServices(FALLBACK_SERVICES);
      }
    }).catch(() => {
      setServices(FALLBACK_SERVICES);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const categoryTabs = ["Все", ...categories];

  const filtered =
    activeCategory === "Все"
      ? services
      : services.filter((s) => s.category === activeCategory);

  const toggleExpand = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleRowEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const row = e.currentTarget;
    const chevron = row.querySelector(".chevron-icon");
    gsap.to(row, { backgroundColor: "rgba(42,50,80,0.04)", x: 10, duration: 0.3, ease: "power2.out" });
    if (chevron) gsap.to(chevron, { y: 3, duration: 0.3, ease: "power2.out" });
  }, []);

  const handleRowLeave = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const row = e.currentTarget;
    const chevron = row.querySelector(".chevron-icon");
    gsap.to(row, { backgroundColor: "transparent", x: 0, duration: 0.3, ease: "power2.out" });
    if (chevron) gsap.to(chevron, { y: 0, duration: 0.3, ease: "power2.out" });
  }, []);

  useEffect(() => {
    detailsRefs.current.forEach((el, id) => {
      if (!el) return;
      if (expandedId === id) {
        gsap.set(el, { display: "block" });
        gsap.to(el, { height: "auto", autoAlpha: 1, duration: 0.4, ease: "power2.inOut" });
      } else if (el.offsetHeight > 0) {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.35, ease: "power2.inOut", onComplete: () => { gsap.set(el, { display: "none" }); } });
      }
    });
  }, [expandedId]);

  useGSAP(
    () => {
      // Heading reveal
      gsap.from(".services-heading", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".services-heading",
          start: "top 88%",
          once: true,
        },
      });

      // Price list card
      gsap.from(".services-list", {
        y: 50,
        opacity: 0,
        scale: 0.97,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".services-list",
          start: "top 85%",
          once: true,
        },
      });

    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-[var(--muted)] dark:bg-transparent pb-28 pt-16 sm:pt-20"
    >
      {/* Subtle floating accent */}
      <div className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="services-heading mb-12">
          <span className="font-[var(--font-mono)] text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Услуги клиники
          </span>
          <h2 className="text-fluid-h1 mt-3 font-[var(--font-heading)] text-foreground">
            Стоимость услуг
          </h2>
          <p className="mt-3 text-muted-foreground">
            Консультация всех специалистов —{" "}
            <span className="font-semibold text-foreground">бесплатно</span>
          </p>
        </div>

        {/* Category tabs */}
        <div className="services-tabs mb-8 flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setActiveCategory("Все");
              setExpandedId(null);
            }}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200",
              activeCategory === "Все"
                ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            Все
          </button>
          {categories.map((label) => (
            <button
              key={label}
              onClick={() => {
                setActiveCategory(label);
                setExpandedId(null);
              }}
              className={cn(
                "rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200",
                activeCategory === label
                  ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Price list */}
        <div className="services-list overflow-hidden rounded-2xl border border-border bg-card/80 shadow-xl shadow-primary/5 backdrop-blur-sm">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-5 sm:gap-6 sm:px-8 sm:py-7">
                <div className="h-5 flex-1 animate-pulse rounded bg-muted" />
                <div className="hidden h-4 w-20 animate-pulse rounded bg-muted sm:block" />
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                <div className="h-5 w-5 animate-pulse rounded bg-muted" />
              </div>
            ))
          ) : filtered.map((service, idx) => {
            const isExpanded = expandedId === service.id;
            const isLast = idx === filtered.length - 1;

            return (
              <div key={service.id}>
                <button
                  onClick={() => toggleExpand(service.id)}
                  onMouseEnter={handleRowEnter}
                  onMouseLeave={handleRowLeave}
                  className={cn(
                    "service-row group flex w-full items-center gap-4 px-4 py-5 sm:gap-6 sm:px-8 sm:py-7 text-left",
                    isExpanded && "bg-card/60"
                  )}
                >
                  <span className="flex-1 text-sm sm:text-xl font-medium text-foreground">
                    {service.name}
                  </span>

                  <span className="hidden shrink-0 items-center gap-1.5 text-base text-muted-foreground sm:flex">
                    <Clock className="h-4 w-4" />
                    {service.duration}
                  </span>

                  <span className="w-24 sm:w-40 shrink-0 text-right font-[var(--font-mono)] text-sm sm:text-lg font-bold text-foreground">
                    {service.price}
                  </span>

                  <ChevronDown
                    className={cn(
                      "chevron-icon h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                <div
                  ref={(el) => {
                    if (el) detailsRefs.current.set(service.id, el);
                  }}
                  className="overflow-hidden"
                  style={{ height: 0, visibility: "hidden", display: "none" }}
                >
                  <div className="px-4 pb-5 pt-2 sm:px-8 sm:pb-7">
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    {service.details && service.details !== service.description && (
                      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                        {service.details}
                      </p>
                    )}
                  </div>
                </div>

                {!isLast && (
                  <div className="mx-6 h-px bg-primary/8" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Wave → Doctors (white bg) */}
    </section>
  );
}
