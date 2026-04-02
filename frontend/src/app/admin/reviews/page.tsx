"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import gsap from "gsap";

interface Review {
  id: number;
  authorName: string;
  text: string;
  rating: number;
  source: string;
  isApproved: boolean;
  isVisible: boolean;
  createdAt: string;
}

interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
}

const SOURCE_LABELS: Record<string, string> = { site: "Сайт", "2gis": "2GIS", yandex: "Яндекс" };

function Skeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="h-4 w-12 rounded bg-gray-100" />
            <div className="h-4 w-20 rounded bg-gray-100" />
          </div>
          <div className="mt-3 h-3 w-full rounded bg-gray-100" />
          <div className="mt-2 h-3 w-3/4 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter) params.set("isApproved", filter);
    api.get<ReviewsResponse>(`/reviews/all?${params}`).then((d) => {
      setData(d);
      setLoading(false);
      // Анимируем карточки после рендера
      requestAnimationFrame(() => {
        if (listRef.current) {
          gsap.fromTo(
            listRef.current.querySelectorAll(".review-card"),
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: "power3.out" }
          );
        }
      });
    }).catch(console.error);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const moderate = async (id: number, isApproved: boolean) => {
    await api.put(`/reviews/${id}`, { isApproved });
    load();
  };

  const toggleVisibility = async (id: number, isVisible: boolean) => {
    await api.put(`/reviews/${id}`, { isVisible });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Удалить отзыв?")) return;
    await api.delete(`/reviews/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#2a3250]">Отзывы</h1>

      <div className="mt-4 flex gap-2">
        {[{ v: "", l: "Все" }, { v: "false", l: "На модерации" }, { v: "true", l: "Одобренные" }].map((f) => (
          <button key={f.v} onClick={() => setFilter(f.v)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${filter === f.v ? "bg-[#2a3250] text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            {f.l}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? <Skeleton /> : (
          <div ref={listRef} className="space-y-4">
            {data?.reviews.map((r) => (
              <div key={r.id} className="review-card rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{r.authorName}</span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{SOURCE_LABELS[r.source] || r.source}</span>
                      <span className="text-sm text-yellow-500">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{r.text}</p>
                    <p className="mt-2 text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("ru-RU")}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!r.isApproved ? (
                      <button onClick={() => moderate(r.id, true)} className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors">Одобрить</button>
                    ) : (
                      <button onClick={() => moderate(r.id, false)} className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors">Снять</button>
                    )}
                    <button onClick={() => toggleVisibility(r.id, !r.isVisible)} className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                      {r.isVisible ? "Скрыть" : "Показать"}
                    </button>
                    <button onClick={() => remove(r.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors">Удалить</button>
                  </div>
                </div>
              </div>
            ))}
            {data?.reviews.length === 0 && <p className="py-8 text-center text-gray-400">Отзывов нет</p>}
          </div>
        )}
      </div>
    </div>
  );
}
