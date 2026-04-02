"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  source?: string;
}

interface ApiReview {
  id: number;
  authorName: string;
  text: string;
  rating: number;
  source: string;
}

interface ReviewsResponse {
  reviews: ApiReview[];
  total: number;
}

const FALLBACK_REVIEWS: Review[] = [
  { id: 1, name: "Анна Соколова", rating: 5, text: "Прекрасная клиника! Делала виниры в IQ Dental — результат превзошёл все ожидания." },
  { id: 2, name: "Дмитрий Кузнецов", rating: 4, text: "Обратился с острой болью — приняли в тот же день. Лечение прошло быстро и безболезненно." },
  { id: 3, name: "Елена Васильева", rating: 5, text: "Проходила профессиональную чистку и отбеливание. Эффект потрясающий!" },
  { id: 4, name: "Михаил Петров", rating: 4, text: "Ставил имплант. Процедура прошла комфортно, хотя я очень боялся." },
  { id: 5, name: "Ольга Новикова", rating: 5, text: "Лечим всей семьёй зубы только здесь. Детский стоматолог — просто волшебница!" },
  { id: 6, name: "Артём Лебедев", rating: 4, text: "Исправлял прикус с помощью элайнеров. За полгода зубы встали ровно." },
  { id: 7, name: "Марина Козлова", rating: 5, text: "Очень боялась удалять зуб мудрости, но всё прошло идеально." },
  { id: 8, name: "Сергей Волков", rating: 4, text: "Делал протезирование. Коронки выглядят как родные зубы." },
  { id: 9, name: "Наталья Орлова", rating: 5, text: "Хожу уже третий год. Всегда приятная атмосфера и никаких очередей." },
];

function StarRating({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn("h-4 w-4 transition-colors", star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-white/20 text-foreground/20", interactive && "h-5 w-5 cursor-pointer hover:text-yellow-400")}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase();
}

function TestimonialsColumn({ testimonials, className, pixelsPerSecond = 20 }: { testimonials: Review[]; className?: string; pixelsPerSecond?: number }) {
  const columnRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!columnRef.current) return;
    const height = columnRef.current.scrollHeight / 2;
    const duration = height / pixelsPerSecond;
    gsap.to(columnRef.current, { y: "-50%", duration, repeat: -1, ease: "none" });
  }, { scope: columnRef, dependencies: [testimonials] });

  return (
    <div className={cn("overflow-hidden", className)}>
      <div ref={columnRef} className="flex flex-col gap-6 pb-6">
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map((review) => (
              <div key={`${index}-${review.id}`} className="liquid-glass-dark w-full max-w-xs rounded-2xl p-6">
                <StarRating rating={review.rating} />
                <p className="mt-4 text-sm leading-relaxed text-white/70">{review.text}</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">{getInitials(review.name)}</div>
                  <div className="text-sm font-medium tracking-tight text-white">{review.name}</div>
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
  const sectionRef = useRef<HTMLElement>(null);
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [formName, setFormName] = useState("");
  const [formRating, setFormRating] = useState(0);
  const [formText, setFormText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get<ReviewsResponse>("/reviews?limit=50").then((data) => {
      if (data.reviews.length > 0) {
        setReviews(data.reviews.map((r) => ({
          id: r.id, name: r.authorName, rating: r.rating, text: r.text, source: r.source,
        })));
      }
    }).catch(console.error);
  }, []);

  const firstColumn = reviews.slice(0, Math.ceil(reviews.length / 3));
  const secondColumn = reviews.slice(Math.ceil(reviews.length / 3), Math.ceil(reviews.length * 2 / 3));
  const thirdColumn = reviews.slice(Math.ceil(reviews.length * 2 / 3));

  useGSAP(() => {
    gsap.from(".reviews-heading > *", {
      y: 40,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: { trigger: ".reviews-heading", start: "top 88%", once: true },
    });

    gsap.from(".reviews-form", {
      y: 50,
      opacity: 0,
      scale: 0.96,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".reviews-form", start: "top 85%", once: true },
    });
  }, { scope: sectionRef });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formRating || !formText) return;
    try {
      await api.post("/reviews", { authorName: formName, text: formText, rating: formRating });
      setSubmitted(true);
      setFormName(""); setFormRating(0); setFormText("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section ref={sectionRef} id="reviews" className="relative bg-[#0a0f1a] pb-28 pt-16 text-white sm:pt-20">
      {/* Accent orbs */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-80 w-80 rounded-full bg-white/3 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-primary/8 blur-3xl" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reviews-heading mb-[var(--space-lg)]">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">Отзывы</span>
          <h2 className="text-fluid-h1 font-heading text-white">Что говорят пациенты</h2>
          <p className="mt-4 max-w-xl text-fluid-body text-white/50">Рейтинг 4.0 на ПроДокторов</p>
        </div>

        <div className="flex justify-center gap-6 max-h-[740px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} pixelsPerSecond={18} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" pixelsPerSecond={15} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" pixelsPerSecond={20} />
        </div>

        <div className="reviews-form mx-auto mt-[var(--space-xl)] max-w-2xl liquid-glass-dark rounded-2xl p-8">
          <h3 className="mb-6 text-center text-fluid-h3 font-heading text-white">Оставьте свой отзыв</h3>

          {submitted && (
            <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center text-sm text-green-400">
              Спасибо за ваш отзыв!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="review-name" className="mb-2 block text-sm font-medium text-muted-foreground">Ваше имя</label>
              <input id="review-name" type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Иван Иванов"
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/30 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" required />
            </div>
            <div>
              <span className="mb-2 block text-sm font-medium text-muted-foreground">Ваша оценка</span>
              <StarRating rating={formRating} interactive onRate={setFormRating} />
            </div>
            <div>
              <label htmlFor="review-text" className="mb-2 block text-sm font-medium text-muted-foreground">Текст отзыва</label>
              <textarea id="review-text" value={formText} onChange={(e) => setFormText(e.target.value)} placeholder="Расскажите о вашем опыте..." rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder-white/30 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" required />
            </div>
            <button type="submit" className="w-full rounded-xl bg-white px-6 py-3.5 font-semibold text-[#0a0f1a] transition-all duration-300 hover:bg-white/90 focus:outline-none">
              Отправить отзыв
            </button>
          </form>
        </div>
      </div>

      {/* Wave → Promotions (white) */}
    </section>
  );
}
