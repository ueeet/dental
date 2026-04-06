"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";
import { onSSE } from "@/lib/sse";
import { CustomSelect } from "@/components/ui/custom-select";
import { DatePicker } from "@/components/ui/date-picker";
import gsap from "gsap";

interface Doctor { id: number; name: string; specialty: string; schedule: Record<string, { start: string; end: string }> | null; }
interface Service { id: number; name: string; price: number; duration: number; }
interface OccupiedSlot { time: string; duration: number; }
interface DayScheduleResponse { available: boolean; schedule: { start: string; end: string } | null; }

const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

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
  new: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400",
  completed: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400",
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
    <div className="overflow-x-auto rounded-2xl bg-card shadow-sm">
      <div className="border-b border-border px-5 py-3"><div className="flex gap-8">{[1,2,3,4,5,6].map(i => <div key={i} className="h-3 w-20 animate-pulse rounded bg-muted" />)}</div></div>
      {[1,2,3,4,5].map(i => <div key={i} className="flex items-center gap-8 border-b border-border/50 px-5 py-4"><div className="h-4 w-28 animate-pulse rounded bg-muted" /><div className="h-3 w-24 animate-pulse rounded bg-muted/60" /><div className="h-3 w-20 animate-pulse rounded bg-muted/60" /><div className="h-3 w-32 animate-pulse rounded bg-muted/60" /><div className="h-3 w-20 animate-pulse rounded bg-muted/60" /><div className="h-5 w-24 animate-pulse rounded-full bg-muted" /></div>)}
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
  const [creating, setCreating] = useState(false);
  const [editForm, setEditForm] = useState({ doctorId: 0, serviceId: 0, date: "", time: "", patientName: "", phone: "", comment: "" });
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [saving, setSaving] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>(TIMES);
  const [dateAvailCache, setDateAvailCache] = useState<Record<string, boolean>>({});
  const loadRef = useRef<() => void>(() => {});
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get<Doctor[]>("/doctors?active=false").then(setDoctors).catch(console.error);
    api.get<Service[]>("/services").then(setServices).catch(console.error);
  }, []);

  // Load available time slots when doctor + date change in form
  useEffect(() => {
    if (!editForm.doctorId || !editForm.date) { setAvailableSlots(TIMES); return; }
    Promise.all([
      api.get<DayScheduleResponse>(`/doctors/${editForm.doctorId}/day-schedule?date=${editForm.date}`),
      api.get<{ occupied: OccupiedSlot[] }>(`/bookings/slots?doctorId=${editForm.doctorId}&date=${editForm.date}`),
    ]).then(([dayData, slotsData]) => {
      if (!dayData.available || !dayData.schedule) { setAvailableSlots([]); return; }
      const { start, end } = dayData.schedule;
      const occupiedSet = new Set(slotsData.occupied.map((o) => o.time));
      const slots = TIMES.filter((t) => t >= start && t < end && !occupiedSet.has(t));
      setAvailableSlots(slots);
      if (editForm.time && !slots.includes(editForm.time)) setEditForm((prev) => ({ ...prev, time: slots[0] || "" }));
    }).catch(() => setAvailableSlots(TIMES));
  }, [editForm.doctorId, editForm.date]);

  // Pre-load date availability for selected doctor
  useEffect(() => {
    if (!editForm.doctorId) { setDateAvailCache({}); return; }
    const today = new Date();
    const dates: string[] = [];
    for (let m = 0; m < 2; m++) {
      const month = today.getMonth() + m;
      const year = today.getFullYear() + Math.floor(month / 12);
      const daysInMonth = new Date(year, (month % 12) + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        dates.push(`${year}-${String((month % 12) + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
      }
    }
    Promise.all(dates.map(async (dateStr) => {
      try {
        const data = await api.get<DayScheduleResponse>(`/doctors/${editForm.doctorId}/day-schedule?date=${dateStr}`);
        return { dateStr, available: data.available };
      } catch { return { dateStr, available: true }; }
    })).then((results) => {
      const cache: Record<string, boolean> = {};
      results.forEach((r) => { cache[r.dateStr] = r.available; });
      setDateAvailCache(cache);
    });
  }, [editForm.doctorId]);

  const isDateDisabledAdmin = (dateStr: string): boolean => {
    if (dateStr in dateAvailCache) return !dateAvailCache[dateStr];
    return false;
  };

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "50");
    // For archive filters and active, we fetch all and filter client-side
    if (filter === "new" || filter === "confirmed") {
      params.set("status", filter);
    }
    if (search) params.set("search", search);
    return params;
  }, [filter, search, page]);

  const filterBookings = useCallback((bookings: Booking[]) => {
    if (filter === "archive") return bookings.filter((b) => b.status === "completed" || b.status === "cancelled");
    if (filter === "archive_completed") return bookings.filter((b) => b.status === "completed");
    if (filter === "archive_cancelled") return bookings.filter((b) => b.status === "cancelled");
    if (filter === "") return bookings.filter((b) => b.status === "new" || b.status === "confirmed");
    return bookings;
  }, [filter]);

  const load = useCallback(() => {
    setLoading(true);
    const params = buildParams();
    api.get<BookingsResponse>(`/bookings?${params}`).then((d) => {
      setData({ ...d, bookings: filterBookings(d.bookings) });
      setLoading(false);
      requestAnimationFrame(() => {
        if (tableRef.current) {
          gsap.fromTo(tableRef.current.querySelectorAll(".booking-row"), { x: -15, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power3.out" });
        }
      });
    }).catch(console.error);
  }, [buildParams, filterBookings]);

  const silentLoad = useCallback(() => {
    const params = buildParams();
    api.get<BookingsResponse>(`/bookings?${params}`).then((d) => {
      setData({ ...d, bookings: filterBookings(d.bookings) });
    }).catch(console.error);
  }, [buildParams, filterBookings]);

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

  const openCreate = () => {
    setCreating(true);
    setEditForm({
      doctorId: doctors[0]?.id || 0,
      serviceId: services[0]?.id || 0,
      date: new Date().toISOString().slice(0, 10),
      time: "09:00",
      patientName: "",
      phone: "",
      comment: "",
    });
  };

  const saveCreate = async () => {
    if (!editForm.patientName.trim() || !editForm.phone.trim()) {
      alert("Заполните ФИО и телефон");
      return;
    }
    setSaving(true);
    try {
      await api.post("/bookings", {
        doctorId: editForm.doctorId,
        serviceId: editForm.serviceId,
        date: editForm.date,
        time: editForm.time,
        patientName: editForm.patientName.trim(),
        phone: editForm.phone.trim(),
        consentGiven: true,
      });
      setCreating(false);
      silentLoad();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка создания");
    }
    setSaving(false);
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
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground shrink-0">Записи</h1>
        <button onClick={openCreate} className="shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          + Новая запись
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input type="text" placeholder="Поиск по имени / телефону" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
        {[
          { value: "", label: "Активные" },
          { value: "new", label: "Новые" },
          { value: "confirmed", label: "Подтверждённые" },
          { value: "archive", label: "Архив" },
        ].map((s) => (
          <button key={s.value} onClick={() => { setFilter(s.value); setPage(1); }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
              s.value === "archive"
                ? (filter === "archive" || filter === "archive_completed" || filter === "archive_cancelled")
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:bg-accent"
                : filter === s.value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:bg-accent"
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {(filter === "archive" || filter === "archive_completed" || filter === "archive_cancelled") && (
        <div className="mt-2 flex gap-2">
          {[
            { value: "archive", label: "Все" },
            { value: "archive_completed", label: "Завершённые" },
            { value: "archive_cancelled", label: "Отменённые" },
          ].map((s) => (
            <button key={s.value} onClick={() => { setFilter(s.value); setPage(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${filter === s.value ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        {loading ? <Skeleton /> : (
          <div ref={tableRef} className="overflow-x-auto rounded-2xl bg-card shadow-sm">
            <table className="min-w-[800px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3">Пациент</th>
                  <th className="px-4 py-3">Телефон</th>
                  <th className="px-4 py-3">Врач</th>
                  <th className="px-4 py-3">Услуга</th>
                  <th className="px-4 py-3">Дата</th>
                  <th className="px-4 py-3">Статус</th>
                  <th className="px-4 py-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {data?.bookings.map((b) => (
                  <tr key={b.id} className="booking-row border-b border-border/50 hover:bg-accent/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{b.patientName}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{b.phone}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{b.doctor.name.split(" ").slice(0, 2).join(" ")}</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.service.name}</td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{new Date(b.date).toLocaleDateString("ru-RU")} {b.time}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLORS[b.status]}`}>
                        {STATUS_LABELS[b.status] || b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {(b.status === "new" || b.status === "confirmed") && (
                          <>
                            <button onClick={() => openEdit(b)} className="rounded-lg bg-accent px-2.5 py-1 text-xs font-medium text-foreground hover:bg-accent/80 transition-colors">Изменить</button>
                            {b.status === "new" && (
                              <button onClick={() => changeStatus(b.id, "confirmed")} className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900 transition-colors">Подтвердить</button>
                            )}
                            <button onClick={() => changeStatus(b.id, "cancelled")} className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 transition-colors">Отменить</button>
                          </>
                        )}
                        {(b.status === "completed" || b.status === "cancelled") && (
                          <button onClick={() => deleteBooking(b.id)} className="rounded-lg bg-accent px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors">Удалить</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {data?.bookings.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">Записей нет</td></tr>
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
              className={`h-9 w-9 rounded-xl text-sm font-medium transition ${page === i + 1 ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-accent"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 overflow-y-auto" onMouseDown={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-card p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-foreground">Изменить запись #{editing.id}</h2>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Пациент</label>
                  <input value={editForm.patientName} onChange={(e) => setEditForm({ ...editForm, patientName: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Телефон</label>
                  <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Врач</label>
                <CustomSelect
                  value={String(editForm.doctorId)}
                  onChange={(v) => setEditForm({ ...editForm, doctorId: Number(v) })}
                  placeholder="Выберите врача"
                  options={doctors.map((d) => ({ value: String(d.id), label: `${d.name} — ${d.specialty}` }))}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Услуга</label>
                <CustomSelect
                  value={String(editForm.serviceId)}
                  onChange={(v) => setEditForm({ ...editForm, serviceId: Number(v) })}
                  placeholder="Выберите услугу"
                  options={services.map((s) => ({ value: String(s.id), label: `${s.name} — ${s.price.toLocaleString("ru-RU")} ₽` }))}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Дата</label>
                <DatePicker
                  value={editForm.date}
                  onChange={(v) => setEditForm({ ...editForm, date: v, time: "" })}
                  min={getTodayString()}
                  inline
                  isDateDisabled={isDateDisabledAdmin}
                />
              </div>

              {editForm.date && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Время — {new Date(editForm.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                  </label>
                  {availableSlots.length === 0 ? (
                    <p className="py-3 text-sm text-red-500">Врач не принимает в этот день</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                      {availableSlots.map((slot) => (
                        <button key={slot} type="button" onClick={() => setEditForm({ ...editForm, time: slot })}
                          className={`rounded-lg border px-3 py-2 text-sm transition-colors ${editForm.time === slot ? "border-primary bg-primary text-white" : "border-border hover:border-primary hover:bg-primary/5"}`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Комментарий</label>
                <textarea value={editForm.comment} onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  rows={2} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={saveEdit} disabled={saving}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                {saving ? "Сохранение..." : "Сохранить"}
              </button>
              <button onClick={() => setEditing(null)}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80">Отмена</button>
            </div>
          </div>
        </div>
      )}

      {creating && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 overflow-y-auto" onMouseDown={(e) => { if (e.target === e.currentTarget) setCreating(false); }}>
          <div className="w-full max-w-lg rounded-t-2xl sm:rounded-2xl bg-card p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-foreground">Новая запись</h2>
            <p className="mt-1 text-sm text-muted-foreground">Запись пациента по звонку</p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Врач</label>
                <CustomSelect
                  value={String(editForm.doctorId)}
                  onChange={(v) => setEditForm({ ...editForm, doctorId: Number(v) })}
                  placeholder="Выберите врача"
                  options={doctors.map((d) => ({ value: String(d.id), label: `${d.name} — ${d.specialty}` }))}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Услуга</label>
                <CustomSelect
                  value={String(editForm.serviceId)}
                  onChange={(v) => setEditForm({ ...editForm, serviceId: Number(v) })}
                  placeholder="Выберите услугу"
                  options={services.map((s) => ({ value: String(s.id), label: `${s.name} — ${s.price.toLocaleString("ru-RU")} ₽` }))}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">Дата</label>
                <DatePicker
                  value={editForm.date}
                  onChange={(v) => setEditForm({ ...editForm, date: v, time: "" })}
                  min={getTodayString()}
                  inline
                  isDateDisabled={isDateDisabledAdmin}
                />
              </div>

              {editForm.date && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Время — {new Date(editForm.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                  </label>
                  {availableSlots.length === 0 ? (
                    <p className="py-3 text-sm text-red-500">Врач не принимает в этот день</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                      {availableSlots.map((slot) => (
                        <button key={slot} type="button" onClick={() => setEditForm({ ...editForm, time: slot })}
                          className={`rounded-lg border px-3 py-2 text-sm transition-colors ${editForm.time === slot ? "border-primary bg-primary text-white" : "border-border hover:border-primary hover:bg-primary/5"}`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">ФИО пациента</label>
                  <input value={editForm.patientName} onChange={(e) => setEditForm({ ...editForm, patientName: e.target.value })} placeholder="Иванов Иван Иванович"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Телефон</label>
                  <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} placeholder="+7 (___) ___-__-__"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={saveCreate} disabled={saving}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                {saving ? "Создание..." : "Записать пациента"}
              </button>
              <button onClick={() => setCreating(false)}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
