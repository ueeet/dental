"use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Анна Соколова",
    rating: 5,
    text: "Прекрасная клиника! Делала виниры в IQ Dental — результат превзошёл все ожидания. Врачи внимательные, всё объясняют на каждом этапе. Теперь улыбаюсь без стеснения!",
  },
  {
    id: 2,
    name: "Дмитрий Кузнецов",
    rating: 4,
    text: "Обратился с острой болью — приняли в тот же день. Лечение прошло быстро и безболезненно. Очень доволен сервисом и профессионализмом персонала IQ Dental.",
  },
  {
    id: 3,
    name: "Елена Васильева",
    rating: 5,
    text: "Проходила профессиональную чистку и отбеливание. Эффект потрясающий — зубы стали на несколько тонов светлее. Рекомендую IQ Dental всем знакомым!",
  },
  {
    id: 4,
    name: "Михаил Петров",
    rating: 4,
    text: "Ставил имплант в IQ Dental. Процедура прошла комфортно, хотя я очень боялся. Врач подробно рассказал план лечения и поддерживал на каждом этапе. Спасибо!",
  },
  {
    id: 5,
    name: "Ольга Новикова",
    rating: 5,
    text: "Лечим всей семьёй зубы только в IQ Dental. Детский стоматолог — просто волшебница, ребёнок идёт на приём с удовольствием. Современное оборудование и уютная атмосфера.",
  },
  {
    id: 6,
    name: "Артём Лебедев",
    rating: 4,
    text: "Исправлял прикус с помощью элайнеров. За полгода зубы встали ровно, как и обещали. Клиника IQ Dental оправдывает своё название — действительно умный подход к стоматологии.",
  },
  {
    id: 7,
    name: "Марина Козлова",
    rating: 5,
    text: "Очень боялась удалять зуб мудрости, но в IQ Dental всё прошло идеально. Никакой боли, быстрое восстановление. Благодарна врачам за профессионализм и заботу!",
  },
  {
    id: 8,
    name: "Сергей Волков",
    rating: 4,
    text: "Делал протезирование в IQ Dental. Качество работы на высшем уровне — коронки выглядят как родные зубы. Отдельное спасибо за терпение и внимание к деталям.",
  },
  {
    id: 9,
    name: "Наталья Орлова",
    rating: 5,
    text: "Хожу в IQ Dental уже третий год на профилактические осмотры. Всегда приятная атмосфера, вежливый персонал и никаких очередей. Лучшая стоматология в городе!",
  },
];

const firstColumn = reviews.slice(0, 3);
const secondColumn = reviews.slice(3, 6);
const thirdColumn = reviews.slice(6, 9);

function StarRating({
  rating,
  interactive = false,
  onRate,
}: {
  rating: number;
  interactive?: boolean;
  onRate?: (value: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4 transition-colors",
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-white/20 text-white/20",
            interactive && "cursor-pointer hover:text-yellow-400 h-5 w-5"
          )}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function TestimonialsColumn({
  testimonials,
  className,
  duration = 10,
}: {
  testimonials: Review[];
  className?: string;
  duration?: number;
}) {
  const columnRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!columnRef.current) return;
      gsap.to(columnRef.current, {
        y: "-50%",
        duration,
        repeat: -1,
        ease: "none",
      });
    },
    { scope: columnRef }
  );

  return (
    <div className={cn("overflow-hidden", className)}>
      <div ref={columnRef} className="flex flex-col gap-6 pb-6">
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map((review) => (
              <div
                key={`${index}-${review.id}`}
                className="glass-card-dark rounded-2xl p-6 max-w-xs w-full"
              >
                <StarRating rating={review.rating} />
                <p className="mt-4 text-white/70 text-sm leading-relaxed">
                  {review.text}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                    {getInitials(review.name)}
                  </div>
                  <div className="text-sm font-medium tracking-tight text-white">
                    {review.name}
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function Reviews() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [formText, setFormText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formRating || !formText) return;
    setSubmitted(true);
    setFormName("");
    setFormRating(0);
    setFormText("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="reviews" className="bg-[#0a0f1a] text-white py-[var(--space-section)]">
      <div ref={containerRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div
          className="mb-3"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            Отзывы
          </span>
        </div>

        {/* Heading */}
        <div
          className="mb-[var(--space-lg)]"
        >
          <h2 className="text-fluid-h1 font-heading text-white">
            Что говорят пациенты
          </h2>
          <p className="mt-4 text-fluid-body text-white/50 max-w-xl">
            Рейтинг 4.0 на ПроДокторов
          </p>
        </div>

        {/* Testimonials Columns */}
        <div
          className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>

        {/* Review Submission Form */}
        <div
          className="mx-auto mt-[var(--space-xl)] max-w-2xl glass-card-dark rounded-2xl p-8"
        >
          <h3 className="mb-6 text-center text-fluid-h3 font-heading text-white">
            Оставьте свой отзыв
          </h3>

          {submitted && (
            <div className="mb-6 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-center text-green-400 text-sm">
              Спасибо за ваш отзыв!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="review-name"
                className="mb-2 block text-sm font-medium text-white/60"
              >
                Ваше имя
              </label>
              <input
                id="review-name"
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Иван Иванов"
                className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-white placeholder-white/30 transition-colors focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                required
              />
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-white/60">
                Ваша оценка
              </span>
              <StarRating
                rating={formRating}
                interactive
                onRate={setFormRating}
              />
            </div>

            <div>
              <label
                htmlFor="review-text"
                className="mb-2 block text-sm font-medium text-white/60"
              >
                Текст отзыва
              </label>
              <textarea
                id="review-text"
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                placeholder="Расскажите о вашем опыте..."
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-transparent px-4 py-3 text-white placeholder-white/30 transition-colors focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/10"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-white px-6 py-3.5 font-semibold text-[#0a0f1a] transition-all duration-300 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              Отправить отзыв
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
