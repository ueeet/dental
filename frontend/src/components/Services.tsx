"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

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

const categoryTabs: Category[] = ["Все", "Терапия", "Хирургия", "Ортопедия", "Гигиена", "Эстетика"];

const services: Service[] = [
  { id: 1, category: "Терапия", name: "Лечение кариеса", description: "Современное лечение кариеса любой сложности с использованием качественных пломбировочных материалов.", price: "от 3 840 ₽", duration: "60 мин", details: "Включает анестезию, удаление поражённых тканей, установку светоотверждаемой пломбы и полировку. Используем материалы премиум-класса для долговечного результата." },
  { id: 2, category: "Терапия", name: "Лечение пульпита", description: "Эндодонтическое лечение каналов зуба с применением современного оборудования и материалов.", price: "от 5 500 ₽", duration: "90 мин", details: "Проводится под контролем апекслокатора. Включает механическую и медикаментозную обработку каналов, пломбирование гуттаперчей и реставрацию коронковой части." },
  { id: 3, category: "Хирургия", name: "Удаление зуба", description: "Простое и сложное удаление зубов, включая зубы мудрости, с минимальным дискомфортом.", price: "от 2 000 ₽", duration: "30–60 мин", details: "Проводится под качественной анестезией. При сложном удалении используются атравматичные методики для минимизации послеоперационных осложнений." },
  { id: 4, category: "Хирургия", name: "Имплантация", description: "Установка дентальных имплантатов ведущих мировых производителей для восстановления зубного ряда.", price: "от 21 900 ₽", duration: "60–90 мин", details: "Работаем с имплантатами Straumann, Osstem, Astra Tech. Включает хирургический этап установки, формирователь десны. Протезирование оплачивается отдельно." },
  { id: 5, category: "Хирургия", name: "Синус-лифтинг", description: "Операция по наращиванию костной ткани верхней челюсти для последующей имплантации.", price: "от 5 000 ₽", duration: "60–120 мин", details: "Открытый и закрытый синус-лифтинг. Используем качественные костнозамещающие материалы. Возможно одномоментное проведение с имплантацией." },
  { id: 6, category: "Ортопедия", name: "Коронки", description: "Металлокерамические и безметалловые коронки для восстановления формы и функции зубов.", price: "от 9 000 ₽", duration: "2–3 визита", details: "Коронки из диоксида циркония, E-max, металлокерамики. Цифровое сканирование для точного прилегания." },
  { id: 7, category: "Ортопедия", name: "Виниры", description: "Тонкие керамические накладки для идеальной улыбки.", price: "от 38 500 ₽", duration: "2–3 визита", details: "Керамические виниры E-max с минимальной обточкой зуба. Индивидуальное моделирование с помощью Digital Smile Design." },
  { id: 8, category: "Ортопедия", name: "Протезирование", description: "Съёмное и несъёмное протезирование для полного восстановления жевательной функции.", price: "от 18 000 ₽", duration: "3–5 визитов", details: "Бюгельные, нейлоновые, акриловые протезы. Протезирование на имплантатах по системе All-on-4 / All-on-6." },
  { id: 9, category: "Гигиена", name: "Профессиональная чистка", description: "Комплексная гигиена полости рта.", price: "5 700 ₽", duration: "60 мин", details: "Снятие зубного камня ультразвуком, удаление налёта аппаратом Air-Flow, полировка, фторирование." },
  { id: 10, category: "Гигиена", name: "Отбеливание", description: "Профессиональное отбеливание зубов.", price: "от 12 000 ₽", duration: "60–90 мин", details: "Кабинетное отбеливание системой ZOOM или Beyond. Осветление до 8 тонов за один сеанс." },
  { id: 11, category: "Эстетика", name: "Реставрация зубов", description: "Художественная реставрация для восстановления эстетики.", price: "от 4 400 ₽", duration: "60–90 мин", details: "Прямая реставрация композитными материалами премиум-класса. Восстановление анатомической формы." },
];

export default function Services() {
  const [activeCategory, setActiveCategory] = useState<Category>("Все");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const detailsRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const filtered =
    activeCategory === "Все"
      ? services
      : services.filter((s) => s.category === activeCategory);

  const toggleExpand = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    detailsRefs.current.forEach((el, id) => {
      if (!el) return;
      if (expandedId === id) {
        gsap.set(el, { display: "block" });
        gsap.to(el, { height: "auto", autoAlpha: 1, duration: 0.35, ease: "power2.inOut" });
      } else {
        gsap.to(el, {
          height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut",
          onComplete: () => { gsap.set(el, { display: "none" }); },
        });
      }
    });
  }, [expandedId]);

  return (
    <section id="services" className="bg-[var(--muted)] py-[var(--space-section)]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-12">
          <span className="font-[var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
            Услуги клиники
          </span>
          <h2 className="text-fluid-h1 mt-3 font-[var(--font-heading)] text-[var(--foreground)]">
            Стоимость услуг
          </h2>
          <p className="mt-3 text-[var(--muted-foreground)]">
            Консультация всех специалистов — <span className="font-semibold text-[var(--foreground)]">бесплатно</span>
          </p>
        </div>

        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categoryTabs.map((label) => (
            <button
              key={label}
              onClick={() => { setActiveCategory(label); setExpandedId(null); }}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                activeCategory === label
                  ? "bg-[var(--primary)] text-white"
                  : "bg-white text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Price list */}
        <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden">
          {filtered.map((service, idx) => {
            const isExpanded = expandedId === service.id;
            const isLast = idx === filtered.length - 1;

            return (
              <div key={service.id}>
                {/* Row */}
                <button
                  onClick={() => toggleExpand(service.id)}
                  className={cn(
                    "flex w-full items-center gap-6 px-8 py-7 text-left transition-colors duration-150",
                    "hover:bg-[var(--muted)]",
                    isExpanded && "bg-[var(--muted)]"
                  )}
                >
                  {/* Name */}
                  <span className="flex-1 text-xl font-medium text-[var(--foreground)]">
                    {service.name}
                  </span>

                  {/* Duration */}
                  <span className="hidden sm:flex items-center gap-1.5 text-base text-[var(--muted-foreground)] shrink-0">
                    <Clock className="h-4 w-4" />
                    {service.duration}
                  </span>

                  {/* Price */}
                  <span className="font-[var(--font-mono)] text-lg font-bold text-[var(--foreground)] shrink-0 w-40 text-right">
                    {service.price}
                  </span>

                  {/* Chevron */}
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-[var(--muted-foreground)] transition-transform duration-300",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>

                {/* Expandable detail */}
                <div
                  ref={(el) => { if (el) detailsRefs.current.set(service.id, el); }}
                  className="overflow-hidden"
                  style={{ height: 0, visibility: "hidden", display: "none" }}
                >
                  <div className="px-8 pb-7 pt-2">
                    <p className="text-base leading-relaxed text-[var(--muted-foreground)] mb-3">
                      {service.description}
                    </p>
                    <p className="text-base leading-relaxed text-[var(--muted-foreground)]">
                      {service.details}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                {!isLast && <div className="mx-6 h-px bg-[var(--border)]" />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
