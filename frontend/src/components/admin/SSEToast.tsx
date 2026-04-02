"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { onSSEEvent, SSEEvent } from "@/lib/sse";

interface Toast {
  id: number;
  title: string;
  subtitle: string;
  color: string;
}

const EVENT_CONFIG: Record<string, { title: string; color: string }> = {
  new_booking: { title: "Новая запись", color: "#22c55e" },
  booking_updated: { title: "Запись обновлена", color: "#3b82f6" },
  booking_deleted: { title: "Запись удалена", color: "#ef4444" },
};

let toastId = 0;

export default function SSEToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const addToast = useCallback((evt: SSEEvent) => {
    const config = EVENT_CONFIG[evt.type];
    if (!config) return;

    const data = evt.data || {};
    let subtitle = "";
    if (evt.type === "new_booking") {
      subtitle = `${data.patientName || "Пациент"} — ${(data.service as Record<string, unknown>)?.name || ""}`;
    } else if (evt.type === "booking_updated") {
      const statusLabels: Record<string, string> = { new: "Новая", confirmed: "Подтверждена", completed: "Завершена", cancelled: "Отменена" };
      subtitle = `${data.patientName || "Пациент"} → ${statusLabels[data.status as string] || data.status}`;
    } else {
      subtitle = "Запись удалена из системы";
    }

    const id = ++toastId;
    setToasts((prev) => [...prev, { id, title: config.title, subtitle, color: config.color }]);

    // Анимация появления
    requestAnimationFrame(() => {
      const el = document.getElementById(`toast-${id}`);
      if (el) {
        gsap.fromTo(el,
          { x: 80, opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" }
        );
      }
    });

    // Убираем через 4 сек
    setTimeout(() => {
      const el = document.getElementById(`toast-${id}`);
      if (el) {
        gsap.to(el, {
          x: 80, opacity: 0, duration: 0.4, ease: "power2.in",
          onComplete: () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        });
      } else {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }
    }, 4000);
  }, []);

  useEffect(() => {
    return onSSEEvent(addToast);
  }, [addToast]);

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          id={`toast-${t.id}`}
          className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl shadow-black/10"
          style={{ minWidth: 280, opacity: 0 }}
        >
          <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: t.color }} />
          <div>
            <p className="text-sm font-semibold text-[#2a3250]">{t.title}</p>
            <p className="mt-0.5 text-xs text-gray-500">{t.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
