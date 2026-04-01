"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "Как записаться на приём?",
    answer:
      "Через форму на сайте, по телефону +7 (906) 123-27-27 или в мессенджерах.",
  },
  {
    question: "Первичная консультация платная?",
    answer: "Нет, консультация всех специалистов бесплатная.",
  },
  {
    question: "Какие виды оплаты вы принимаете?",
    answer: "Наличные, банковские карты, рассрочка 0%.",
  },
  {
    question: "Больно ли лечить зубы?",
    answer:
      "Используем современные анестетики, лечение проходит полностью безболезненно.",
  },
  {
    question: "Сколько стоит имплантация?",
    answer:
      "От 21 900 \u20BD за имплант, итоговая стоимость зависит от клинической ситуации.",
  },
  {
    question: "Есть ли гарантия на лечение?",
    answer: "Да, предоставляем гарантию на все виды работ.",
  },
  {
    question: "Работаете ли вы по ДМС?",
    answer: "Да, принимаем пациентов по полисам ДМС.",
  },
  {
    question: "Какой у вас график работы?",
    answer: "Пн\u2013Пт: 08:00\u201320:00, Сб\u2013Вс: 09:00\u201318:00.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const answerRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const chevronRefs = useRef<Map<number, HTMLSpanElement>>(new Map());

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  /* Accordion expand/collapse with GSAP */
  useEffect(() => {
    answerRefs.current.forEach((el, index) => {
      if (!el) return;
      if (openIndex === index) {
        gsap.set(el, { display: "block" });
        gsap.to(el, {
          height: "auto",
          autoAlpha: 1,
          duration: 0.4,
          ease: "power2.inOut",
        });
      } else {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(el, { display: "none" });
          },
        });
      }
    });

    /* Chevron rotation */
    chevronRefs.current.forEach((el, index) => {
      if (!el) return;
      gsap.to(el, {
        rotation: openIndex === index ? 180 : 0,
        duration: 0.35,
        ease: "power2.inOut",
      });
    });
  }, [openIndex]);

  return (
    <section
      id="faq"
      className="bg-[var(--background)] py-[var(--space-section)]"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section label + heading */}
        <div
          className="mb-16"
        >
          <span className="font-[var(--font-mono)] text-fluid-small uppercase tracking-[0.15em] text-muted-foreground">
            FAQ
          </span>
          <h2 className="mt-3 font-[var(--font-heading)] text-fluid-h1 text-foreground">
            Часто задаваемые
            <br />
            вопросы
          </h2>
        </div>

        {/* Accordion — editorial lines only, no card borders */}
        <div>
          {/* Top line */}
          <div className="section-line" />

          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className={cn(
                    "flex w-full items-center justify-between gap-6 py-6 sm:py-7 text-left transition-colors duration-200",
                    isOpen
                      ? "text-primary"
                      : "text-foreground hover:text-primary"
                  )}
                >
                  <span className="text-lg font-medium sm:text-xl leading-snug">
                    {item.question}
                  </span>
                  <span
                    ref={(el) => {
                      if (el) chevronRefs.current.set(index, el);
                    }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted transition-colors duration-200"
                  >
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 transition-colors duration-200",
                        isOpen ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </span>
                </button>

                <div
                  ref={(el) => {
                    if (el) answerRefs.current.set(index, el);
                  }}
                  className="overflow-hidden"
                  style={{ height: 0, visibility: "hidden", display: "none" }}
                >
                  <p className="pb-7 text-fluid-body leading-relaxed text-muted-foreground max-w-2xl">
                    {item.answer}
                  </p>
                </div>

                {/* Separator line */}
                <div className="section-line" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
