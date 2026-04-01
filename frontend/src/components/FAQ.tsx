"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
  const containerRef = useRef<HTMLElement>(null);
  const answerRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const chevronRefs = useRef<Map<number, HTMLSpanElement>>(new Map());

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  useGSAP(
    () => {
      /* No scroll-based entrance animations needed for FAQ heading since
         the original didn't have them either — just the accordion behavior */
    },
    { scope: containerRef }
  );

  /* Accordion expand/collapse with GSAP */
  useEffect(() => {
    answerRefs.current.forEach((el, index) => {
      if (!el) return;
      if (openIndex === index) {
        gsap.set(el, { display: "block" });
        gsap.to(el, { height: "auto", autoAlpha: 1, duration: 0.3, ease: "power1.inOut" });
      } else {
        gsap.to(el, {
          height: 0,
          autoAlpha: 0,
          duration: 0.3,
          ease: "power1.inOut",
          onComplete: () => { gsap.set(el, { display: "none" }); },
        });
      }
    });

    /* Chevron rotation */
    chevronRefs.current.forEach((el, index) => {
      if (!el) return;
      gsap.to(el, {
        rotation: openIndex === index ? 180 : 0,
        duration: 0.3,
        ease: "power1.inOut",
      });
    });
  }, [openIndex]);

  return (
    <section id="faq" ref={containerRef} className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
            <HelpCircle className="h-7 w-7 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Часто задаваемые вопросы
          </h2>
        </div>

        {/* Accordion */}
        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-200",
                    isOpen ? "text-blue-600" : "text-gray-900 hover:text-blue-600"
                  )}
                >
                  <span className="text-base font-medium sm:text-lg">
                    {item.question}
                  </span>
                  <span
                    ref={(el) => {
                      if (el) chevronRefs.current.set(index, el);
                    }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 transition-colors duration-200",
                        isOpen ? "text-blue-600" : "text-gray-400"
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
                  <p className="pb-5 text-base leading-relaxed text-gray-600">
                    {item.answer}
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
