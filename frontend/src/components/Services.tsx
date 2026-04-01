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
  Gift,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Category = "Все" | "Терапия" | "Хирургия" | "Ортопедия" | "Гигиена" | "Эстетика";

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

  /* Entrance animations */
  useGSAP(
    () => {
      gsap.from("[data-animate='heading']", {
        autoAlpha: 0,
        y: 24,
        duration: 0.5,
        scrollTrigger: {
          trigger: "[data-animate='heading']",
          start: "top 80%",
          once: true,
        },
      });

      gsap.from("[data-animate='banner']", {
        autoAlpha: 0,
        y: 20,
        duration: 0.5,
        delay: 0.1,
        scrollTrigger: {
          trigger: "[data-animate='banner']",
          start: "top 80%",
          once: true,
        },
      });

      gsap.from("[data-animate='tabs']", {
        autoAlpha: 0,
        y: 16,
        duration: 0.4,
        delay: 0.2,
        scrollTrigger: {
          trigger: "[data-animate='tabs']",
          start: "top 85%",
          once: true,
        },
      });

      ScrollTrigger.batch("[data-animate='card']", {
        onEnter: (batch) => {
          gsap.from(batch, {
            autoAlpha: 0,
            y: 30,
            scale: 0.95,
            duration: 0.4,
            stagger: 0.08,
          });
        },
        start: "top 85%",
        once: true,
      });
    },
    { scope: containerRef, dependencies: [filtered] }
  );

  /* Expand / collapse with GSAP height animation */
  useEffect(() => {
    detailsRefs.current.forEach((el, id) => {
      if (!el) return;
      if (expandedId === id) {
        gsap.set(el, { display: "block" });
        gsap.to(el, { height: "auto", autoAlpha: 1, duration: 0.25, ease: "power1.inOut" });
      } else {
        gsap.to(el, {
          height: 0,
          autoAlpha: 0,
          duration: 0.25,
          ease: "power1.inOut",
          onComplete: () => { gsap.set(el, { display: "none" }); },
        });
      }
    });
  }, [expandedId]);

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative overflow-hidden bg-slate-50 py-20 md:py-28"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-50/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div data-animate="heading" className="mx-auto max-w-2xl text-center" style={{ visibility: "hidden" }}>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Наши услуги
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Полный спектр стоматологических услуг с использованием передовых
            технологий и материалов премиум-класса
          </p>
        </div>

        {/* Free consultation banner */}
        <div data-animate="banner" className="mx-auto mt-10 max-w-3xl" style={{ visibility: "hidden" }}>
          <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white shadow-lg shadow-blue-200/40 sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Gift className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">
                    Бесплатная консультация
                  </h3>
                  <p className="mt-1 text-sm text-blue-100">
                    Запишитесь на бесплатный осмотр и составление плана лечения
                  </p>
                </div>
              </div>
              <a
                href="tel:+79061232727"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50"
              >
                <Phone className="h-4 w-4" />
                Записаться
              </a>
            </div>
          </div>
        </div>

        {/* Category filter tabs */}
        <div data-animate="tabs" className="mt-10 flex flex-wrap justify-center gap-2" style={{ visibility: "hidden" }}>
          {categories.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setActiveCategory(label);
                setExpandedId(null);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
                activeCategory === label
                  ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200/50"
                  : "border-slate-200 bg-white text-muted-foreground hover:border-blue-300 hover:text-blue-600"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Service cards grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => {
            const isExpanded = expandedId === service.id;
            const CatIcon =
              categories.find((c) => c.label === service.category)?.icon ??
              Sparkles;

            return (
              <div
                key={service.id}
                data-animate="card"
                className={cn(
                  "group flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md hover:shadow-blue-100/30",
                  isExpanded && "ring-1 ring-blue-200"
                )}
              >
                {/* Category badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    <CatIcon className="h-3 w-3" />
                    {service.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {service.duration}
                  </span>
                </div>

                {/* Name & description */}
                <h3 className="mt-3 text-lg font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                  {service.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>

                {/* Price */}
                <div className="mt-4 text-xl font-bold text-blue-600">
                  {service.price}
                </div>

                {/* Expand / collapse */}
                <button
                  onClick={() => toggleExpand(service.id)}
                  className="mt-3 inline-flex items-center gap-1 self-start text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  {isExpanded ? "Скрыть" : "Подробнее"}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
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
                  <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-relaxed text-muted-foreground">
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
