"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { onSSE } from "@/lib/sse";
import gsap from "gsap";

interface Doctor { id: number; name: string; specialty: string; }
interface Service { id: number; name: string; price: number; duration: number; }

interface Booking {
  id: number;
  patientName: string;
  phone: string;
  date: string;
  time: string;
  comment: string | null;
  status: string;
  doctorId: number;
  serviceId: number;
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

const TIMES: string[] = [];
for (let h = 8; h <= 20; h++) {
  TIMES.push(`${String(h).padStart(2, "0")}:00`);
  if (h < 20) TIMES.push(`${String(h).padStart(2, "0")}:30`);
}

function Skeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-3"><div className="flex gap-8">{[1,2,3,4,5,6].map(i => <div key={i} className="h-3 w-20 animate-pulse rounded bg-gray-200" />)}</div></div>
      {[1,2,3,4,5].map(i => <div key={i} className="flex items-center gap-8 border-b border-gray-50 px-5 py-4"><div className="h-4 w-28 animate-pulse rounded bg-gray-200" /><div className="h-3 w-24 animate-pulse rounded bg-gray-100" /><div className="h-3 w-20 animate-pulse rounded bg-gray-100" /><div className="h-3 w-32 animate-pulse rounded bg-gray-100" /><div className="h-3 w-20 animate-pulse rounded bg-gray-100" /><div className="h-5 w-24 animate-pulse rounded-full bg-gray-200" /></div>)}
    </div>
  );
}

export default function AdminBookings() {
  const [data, setData] = useState<BookingsResponse | null>(null);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState({ doctorId: 0, serviceId: 0, date: "", time: "", patientName: "", phone: "", comment: "" });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [saving, setSaving] = useState(false);
  const loadRef = useRef<() => void>(() => {});
  const tableRef = useRef<HTMLDivElement>(null);

  // Загрузка врачей и услуг для селектов
  useEffect(() => {
    api.get<Doctor[]>("/doctors").then(setDoctors).catch(console.error);
    api.get<Service[]>("/services").then(setServices).catch(console.error);
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "15");
    if (filter) params.set("status", filter);
    if (search) params.set("search", search);
    api.get<BookingsResponse>(`/bookings?${params}`).then((d) => {
      setData(d);
      setLoading(false);
      requestAnimationFrame(() => {
        if (tableRef.current) {
          gsap.fromTo(tableRef.current.querySelectorAll(".booking-row"), { x: -15, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power3.out" });
        }
      });
    }).catch(console.error);
  }, [filter, search, page]);

  const silentLoad = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "15");
    if (filter) params.set("status", filter);
    if (search) params.set("search", search);
    api.get<BookingsResponse>(`/bookings?${params}`).then(setData).catch(console.error);
  }, [filter, search, page]);

  loadRef.current = silentLoad;

  useEffect(() => { load(); }, [load]);
  useEffect(() => { return onSSE(() => loadRef.current()); }, []);

  const changeStatus = async (id: number, status: string) => {
    await api.put(`/bookings/${id}`, { status });
  };

  const deleteBooking = async (id: number) => {
    if (!confirm("Удалить запись?")) return;
    await api.delete(`/bookings/${id}`);
  };

  const openEdit = (b: Booking) => {
    setEditing(b);
    setEditForm({
      doctorId: b.doctorId,
      serviceId: b.serviceId,
      date: b.date.slice(0, 10),
      time: b.time,
      patientName: b.patientName,
      phone: b.phone,
      comment: b.comment || "",
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await api.put(`/bookings/${editing.id}`, {
        doctorId: editForm.doctorId,
        serviceId: editForm.serviceId,
        date: editForm.date,
        time: editForm.time,
        patientName: editForm.patientName,
        phone: editForm.phone,
        comment: editForm.comment || null,
      });
      setEditing(null);
      silentLoad();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка сохранения");
    }
    setSaving(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#2a3250]">Записи</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input type="text" placeholder="Поиск по имени / телефону" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#2a3250]" />
        {["", "new", "confirmed", "completed", "cancelled"].map((s) => (
          <button key={s} onClick={() => { setFilter(s); setPage(1); }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${filter === s ? "bg-[#2a3250] text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
            {s ? STATUS_LABELS[s] : "Все"}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? <Skeleton /> : (
          <div ref={tableRef} className="overflow-hidden rounded-2xl bg-white shadow-sm">
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
                  <tr key={b.id} className="booking-row border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">{b.patientName}</td>
                    <td className="px-5 py-3 text-gray-600">{b.phone}</td>
                    <td className="px-5 py-3 text-gray-600">{b.doctor.name.split(" ").slice(0, 2).join(" ")}</td>
                    <td className="px-5 py-3 text-gray-600">{b.service.name}</td>
                    <td className="px-5 py-3 text-gray-600">{new Date(b.date).toLocaleDateString("ru-RU")} {b.time}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[b.status]}`}>
                        {STATUS_LABELS[b.status] || b.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(b)} className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors">Изменить</button>
                        {b.status === "new" && (
                          <button onClick={() => changeStatus(b.id, "confirmed")} className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors">Подтвердить</button>
                        )}
                        {(b.status === "new" || b.status === "confirmed") && (
                          <button onClick={() => changeStatus(b.id, "completed")} className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors">Завершить</button>
                        )}
                        {b.status !== "cancelled" && (
                          <button onClick={() => changeStatus(b.id, "cancelled")} className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors">Отменить</button>
                        )}
                        <button onClick={() => deleteBooking(b.id)} className="rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors">Удалить</button>
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
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: data.totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`h-9 w-9 rounded-xl text-sm font-medium transition ${page === i + 1 ? "bg-[#2a3250] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Модалка редактирования */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onMouseDown={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            <h2 className="text-lg font-bold text-[#2a3250]">Изменить запись #{editing.id}</h2>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Пациент</label>
                  <input value={editForm.patientName} onChange={(e) => setEditForm({ ...editForm, patientName: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2a3250]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Телефон</label>
                  <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2a3250]" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Врач</label>
                <select value={editForm.doctorId} onChange={(e) => setEditForm({ ...editForm, doctorId: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2a3250]">
                  {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Услуга</label>
                <select value={editForm.serviceId} onChange={(e) => setEditForm({ ...editForm, serviceId: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2a3250]">
                  {services.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.price.toLocaleString("ru-RU")} ₽</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Дата</label>
                  <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2a3250]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Время</label>
                  <select value={editForm.time} onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2a3250]">
                    {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Комментарий</label>
                <textarea value={editForm.comment} onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  rows={2} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#2a3250]" />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={saveEdit} disabled={saving}
                className="rounded-xl bg-[#2a3250] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#353d5c] disabled:opacity-50">
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
              <button onClick={() => setEditing(null)}
                className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
