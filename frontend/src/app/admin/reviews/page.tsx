"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

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

export default function AdminReviews() {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [filter, setFilter] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".page-title", { y: -20, opacity: 0, duration: 0.5, ease: "power2.out" });
    gsap.from(".page-controls", { y: 20, opacity: 0, duration: 0.5, delay: 0.1, ease: "power2.out" });
    gsap.from(".page-content", { y: 30, opacity: 0, duration: 0.6, delay: 0.2, ease: "power3.out" });
  }, { scope: containerRef });

  const load = useCallback(() => {
    const params = new URLSearchParams();
    if (filter) params.set("isApproved", filter);
    api.get<ReviewsResponse>(`/reviews/all?${params}`).then(setData).catch(console.error);
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
    <div ref={containerRef}>
      <h1 className="page-title text-2xl font-bold text-[#2a3250]">Отзывы</h1>

      <div className="page-controls mt-4 flex gap-2">
        {[{ v: "", l: "Все" }, { v: "false", l: "На модерации" }, { v: "true", l: "Одобренные" }].map((f) => (
          <button key={f.v} onClick={() => setFilter(f.v)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${filter === f.v ? "bg-[#2a3250] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            {f.l}
          </button>
        ))}
      </div>

      <div className="page-content mt-6 space-y-4">
        {data?.reviews.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white p-5 shadow-sm">
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
              <div className="flex items-center gap-1">
                {!r.isApproved ? (
                  <button onClick={() => moderate(r.id, true)} className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100">Одобрить</button>
                ) : (
                  <button onClick={() => moderate(r.id, false)} className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100">Снять</button>
                )}
                <button onClick={() => toggleVisibility(r.id, !r.isVisible)} className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100">
                  {r.isVisible ? "Скрыть" : "Показать"}
                </button>
                <button onClick={() => remove(r.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">Удалить</button>
              </div>
            </div>
          </div>
        ))}
        {data?.reviews.length === 0 && <p className="py-8 text-center text-gray-400">Отзывов нет</p>}
      </div>
    </div>
  );
}
