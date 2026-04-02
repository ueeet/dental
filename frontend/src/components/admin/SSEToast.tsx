"use client";

import { useEffect, useState, useCallback } from "react";
import { onSSEEvent, SSEEvent } from "@/lib/sse";

interface Toast {
  id: number;
  title: string;
  subtitle: string;
  color: string;
  leaving: boolean;
}

const EVENT_CONFIG: Record<string, { title: string; color: string }> = {
  new_booking: { title: "Новая запись", color: "#22c55e" },
  booking_updated: { title: "Запись обновлена", color: "#3b82f6" },
  booking_deleted: { title: "Запись удалена", color: "#ef4444" },
};

let toastId = 0;

export default function SSEToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((evt: SSEEvent) => {
    const config = EVENT_CONFIG[evt.type];
    if (!config) return;

    const data = evt.data || {};
    let subtitle = "";
    if (evt.type === "new_booking") {
      const svcName = (data.service as Record<string, unknown>)?.name || "";
      subtitle = `${data.patientName || "Пациент"} — ${svcName}`;
    } else if (evt.type === "booking_updated") {
      const labels: Record<string, string> = { new: "Новая", confirmed: "Подтверждена", completed: "Завершена", cancelled: "Отменена" };
      subtitle = `${data.patientName || "Пациент"} → ${labels[data.status as string] || data.status}`;
    } else {
      subtitle = "Запись удалена";
    }

    const id = ++toastId;
    setToasts((prev) => [...prev, { id, title: config.title, subtitle, color: config.color, leaving: false }]);

    // Убираем через 6 сек
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => t.id === id ? { ...t, leaving: true } : t));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 500);
    }, 6000);
  }, []);

  useEffect(() => {
    return onSSEEvent(addToast);
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-5 rounded-3xl bg-[#2a3250] px-8 py-6 shadow-2xl shadow-black/30"
          style={{
            minWidth: 420,
            animation: t.leaving ? "toast-out 0.5s ease forwards" : "toast-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}
        >
          <div className="relative shrink-0">
            <div className="h-4 w-4 rounded-full" style={{ backgroundColor: t.color }} />
            <div className="absolute inset-0 h-4 w-4 animate-ping rounded-full" style={{ backgroundColor: t.color, opacity: 0.5 }} />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-white">{t.title}</p>
            <p className="mt-1 text-sm text-gray-300">{t.subtitle}</p>
          </div>
        </div>
      ))}
      <style jsx>{`
        @keyframes toast-in {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes toast-out {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
