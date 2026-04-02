"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { onSSE } from "@/lib/sse";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Booking {
  id: number;
  patientName: string;
  phone: string;
  date: string;
  time: string;
  comment: string | null;
  status: string;
  doctor: { name: string };
  service: { name: string };
  createdAt: string;
}

interface BookingsResponse {
  bookings: Booking[];
  total: number;
  page: number;
  totalPages: number;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  confirmed: "Подтверждена",
  completed: "Завершена",
  cancelled: "Отменена",
};

export default function AdminBookings() {
  const [data, setData] = useState<BookingsResponse | null>(null);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const loadRef = useRef<() => void>(() => {});
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".page-title", { y: -20, opacity: 0, duration: 0.5, ease: "power2.out" });
    gsap.from(".page-controls", { y: 20, opacity: 0, duration: 0.5, delay: 0.1, ease: "power2.out" });
    gsap.from(".page-content", { y: 30, opacity: 0, duration: 0.6, delay: 0.2, ease: "power3.out" });
  }, { scope: containerRef });

  const load = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "15");
    if (filter) params.set("status", filter);
    if (search) params.set("search", search);
    api.get<BookingsResponse>(`/bookings?${params}`).then(setData).catch(console.error);
  }, [filter, search, page]);

  loadRef.current = load;

  useEffect(() => { load(); }, [load]);

  // SSE — realtime
  useEffect(() => {
    return onSSE("*", () => loadRef.current());
  }, []);

  const changeStatus = async (id: number, status: string) => {
    await api.put(`/bookings/${id}`, { status });
  };

  const deleteBooking = async (id: number) => {
    if (!confirm("Удалить запись?")) return;
    await api.delete(`/bookings/${id}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#2a3250]">Записи</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Поиск по имени / телефону"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]"
        />
        {["", "new", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              filter === s ? "bg-[#2a3250] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s ? STATUS_LABELS[s] : "Все"}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
              <th className="px-5 py-3">Пациент</th>
              <th className="px-5 py-3">Телефон</th>
              <th className="px-5 py-3">Врач</th>
              <th className="px-5 py-3">Услуга</th>
              <th className="px-5 py-3">Дата</th>
              <th className="px-5 py-3">Статус</th>
              <th className="px-5 py-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {data?.bookings.map((b) => (
              <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-900">{b.patientName}</td>
                <td className="px-5 py-3 text-gray-600">{b.phone}</td>
                <td className="px-5 py-3 text-gray-600">{b.doctor.name.split(" ").slice(0, 2).join(" ")}</td>
                <td className="px-5 py-3 text-gray-600">{b.service.name}</td>
                <td className="px-5 py-3 text-gray-600">
                  {new Date(b.date).toLocaleDateString("ru-RU")} {b.time}
                </td>
                <td className="px-5 py-3">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[b.status]}`}>
                    {STATUS_LABELS[b.status] || b.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-1">
                    {b.status === "new" && (
                      <button onClick={() => changeStatus(b.id, "confirmed")} className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100">Подтвердить</button>
                    )}
                    {(b.status === "new" || b.status === "confirmed") && (
                      <button onClick={() => changeStatus(b.id, "completed")} className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100">Завершить</button>
                    )}
                    {b.status !== "cancelled" && (
                      <button onClick={() => changeStatus(b.id, "cancelled")} className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100">Отменить</button>
                    )}
                    <button onClick={() => deleteBooking(b.id)} className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100">Удалить</button>
                  </div>
                </td>
              </tr>
            ))}
            {data?.bookings.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-gray-400">Записей нет</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: data.totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-9 w-9 rounded-xl text-sm font-medium transition ${
                page === i + 1 ? "bg-[#2a3250] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
