"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Heart,
  Scissors,
  Crown,
  Sparkles,
  Droplets,
  ChevronDown,
  Clock,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Category =
  | "Все"
  | "Терапия"
  | "Хирургия"
  | "Ортопедия"
  | "Гигиена"
  | "Эстетика";

interface Service {
  id: number;
  category: Exclude<Category, "Все">;
  name: string;
  description: string;
  price: string;
  duration: string;
  details: string;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const categories: { label: Category; icon: React.ElementType }[] = [
  { label: "Все", icon: Sparkles },
  { label: "Терапия", icon: Heart },
  { label: "Хирургия", icon: Scissors },
  { label: "Ортопедия", icon: Crown },
  { label: "Гигиена", icon: Droplets },
  { label: "Эстетика", icon: Sparkles },
];

const services: Service[] = [
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
      "Коронки из диоксида циркония, E-max, металлокерамики. Цифровое сканирование для точного прилегания. Собственная зуботехническая лаборатория.",
  },
  {
    id: 7,
    category: "Ортопедия",
    name: "Виниры",
    description:
      "Тонкие керамические накладки для идеальной улыбки — коррекция формы, цвета и положения зубов.",
    price: "от 38 500 ₽",
    duration: "2–3 визита",
    details:
      "Керамические виниры E-max с минимальной обточкой зуба. Индивидуальное моделирование с помощью Digital Smile Design. Гарантия естественного результата.",
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
      "Бюгельные, нейлоновые, акриловые протезы. Протезирование на имплантатах по системе All-on-4 / All-on-6. Гарантия комфортного ношения.",
  },
  {
    id: 9,
    category: "Гигиена",
    name: "Профессиональная чистка",
    description:
      "Комплексная гигиена полости рта: ультразвук, Air-Flow, полировка, фторирование.",
    price: "5 700 ₽",
    duration: "60 мин",
    details:
      "Снятие зубного камня ультразвуком, удаление пигментированного налёта аппаратом Air-Flow, полировка пастами, укрепление эмали фторсодержащим гелем.",
  },
  {
    id: 10,
    category: "Гигиена",
    name: "Отбеливание",
    description:
      "Профессиональное отбеливание зубов для сияющей белоснежной улыбки.",
    price: "от 12 000 ₽",
    duration: "60–90 мин",
    details:
      "Кабинетное отбеливание системой ZOOM или Beyond. Осветление до 8 тонов за один сеанс. Предварительная профгигиена рекомендуется.",
  },
  {
    id: 11,
    category: "Эстетика",
    name: "Реставрация зубов",
    description:
      "Художественная реставрация для восстановления эстетики и формы передних и жевательных зубов.",
    price: "от 4 400 ₽",
    duration: "60–90 мин",
    details:
      "Прямая реставрация композитными материалами премиум-класса. Восстановление анатомической формы, воссоздание естественного цвета и прозрачности.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Services() {
  const [activeCategory, setActiveCategory] = useState<Category>("Все");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const detailsRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const filtered =
    activeCategory === "Все"
      ? services
      : services.filter((s) => s.category === activeCategory);

  const toggleExpand = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);


  /* ---- Expand / collapse with GSAP height animation ---- */
  useEffect(() => {
    detailsRefs.current.forEach((el, id) => {
      if (!el) return;
      if (expandedId === id) {
        gsap.set(el, { display: "block" });
        gsap.to(el, {
          height: "auto",
          autoAlpha: 1,
          duration: 0.35,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(el, { display: "none" });
          },
        });
      }
    });
  }, [expandedId]);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative bg-[var(--muted)] py-[var(--space-section)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---- Free consultation line ---- */}
        <div
          data-animate="banner"
          className="mb-12 flex items-center justify-center gap-3 text-sm text-[var(--muted-foreground)]"
          
        >
          <span className="h-px w-12 bg-[var(--border)]" />
          <Phone className="h-3.5 w-3.5 text-[var(--primary)]" />
          <span className="font-[var(--font-mono)] uppercase tracking-wider">
            Консультация — бесплатно
          </span>
          <span className="h-px w-12 bg-[var(--border)]" />
        </div>

        {/* ---- Heading ---- */}
        <div
          data-animate="heading"
          className="mx-auto max-w-2xl text-center"
          
        >
          <span className="font-[var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Услуги клиники
          </span>
          <h2 className="text-fluid-h2 mt-3 text-[var(--foreground)]">
            Полный спектр стоматологии
          </h2>
          <p className="text-fluid-body mt-4 text-[var(--muted-foreground)]">
            Передовые технологии и материалы премиум-класса
            для здоровья и красоты вашей улыбки
          </p>
        </div>

        {/* ---- Category tabs ---- */}
        <div
          data-animate="tabs"
          className="mt-10 flex flex-wrap justify-center gap-2"
          
        >
          {categories.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setActiveCategory(label);
                setExpandedId(null);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                activeCategory === label
                  ? "bg-[var(--primary)] text-white"
                  : "bg-white text-[var(--muted-foreground)] hover:text-[var(--primary)]"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* ---- Service cards grid ---- */}
        <div className="group-hover-dim mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => {
            const isExpanded = expandedId === service.id;
            const CatIcon =
              categories.find((c) => c.label === service.category)?.icon ??
              Sparkles;

            return (
              <div
                key={service.id}
                className={cn(
                  "group/card flex flex-col rounded-2xl border border-[var(--border)] bg-white p-8 transition-all duration-300",
                  "hover:-translate-y-1 hover:border-l-4 hover:border-l-[var(--primary)]",
                  isExpanded && "border-l-4 border-l-[var(--primary)]"
                )}
              >
                {/* Category + duration */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
                    <CatIcon className="h-3.5 w-3.5" />
                    {service.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                    <Clock className="h-3 w-3" />
                    {service.duration}
                  </span>
                </div>

                {/* Name */}
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)] transition-colors duration-200 group-hover/card:text-[var(--primary)]">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {service.description}
                </p>

                {/* Price */}
                <div className="mt-5 font-[var(--font-mono)] text-2xl font-bold text-[var(--foreground)]">
                  {service.price}
                </div>

                {/* Expand toggle */}
                <button
                  onClick={() => toggleExpand(service.id)}
                  className="mt-4 inline-flex items-center gap-1 self-start text-sm font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary)]/80"
                >
                  {isExpanded ? "Скрыть" : "Подробнее"}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {/* Expandable detail */}
                <div
                  ref={(el) => {
                    if (el) detailsRefs.current.set(service.id, el);
                  }}
                  className="overflow-hidden"
                  style={{ height: 0, visibility: "hidden", display: "none" }}
                >
                  <p className="mt-4 border-t border-[var(--border)] pt-4 text-sm leading-relaxed text-[var(--muted-foreground)]">
                    {service.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
