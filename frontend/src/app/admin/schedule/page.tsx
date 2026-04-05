"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  schedule: Record<string, { start: string; end: string }> | null;
}

const DAYS = [
  { key: "monday", label: "Понедельник", short: "Пн" },
  { key: "tuesday", label: "Вторник", short: "Вт" },
  { key: "wednesday", label: "Среда", short: "Ср" },
  { key: "thursday", label: "Четверг", short: "Чт" },
  { key: "friday", label: "Пятница", short: "Пт" },
  { key: "saturday", label: "Суббота", short: "Сб" },
  { key: "sunday", label: "Воскресенье", short: "Вс" },
];

const HOURS = Array.from({ length: 15 }, (_, i) => {
  const h = i + 7;
  return `${String(h).padStart(2, "0")}:00`;
});

export default function AdminSchedule() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<Record<string, { start: string; end: string; enabled: boolean }>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get<Doctor[]>("/doctors?active=false").then((data) => {
      setDoctors(data);
      if (data.length > 0) selectDoctor(data[0]);
    }).catch(console.error);
  }, []);

  const selectDoctor = (doc: Doctor) => {
    setSelectedId(doc.id);
    setSaved(false);
    const s: Record<string, { start: string; end: string; enabled: boolean }> = {};
    DAYS.forEach((d) => {
      const existing = doc.schedule?.[d.key];
      s[d.key] = existing
        ? { start: existing.start, end: existing.end, enabled: true }
        : { start: "09:00", end: "18:00", enabled: false };
    });
    setSchedule(s);
  };

  const toggleDay = (key: string) => {
    setSchedule((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const updateTime = (key: string, field: "start" | "end", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const save = async () => {
    if (!selectedId) return;
    setSaving(true);
    const scheduleData: Record<string, { start: string; end: string }> = {};
    DAYS.forEach((d) => {
      if (schedule[d.key]?.enabled) {
        scheduleData[d.key] = { start: schedule[d.key].start, end: schedule[d.key].end };
      }
    });
    try {
      await api.put(`/doctors/${selectedId}`, { schedule: scheduleData });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setDoctors((prev) => prev.map((doc) => doc.id === selectedId ? { ...doc, schedule: scheduleData } : doc));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка сохранения");
    }
    setSaving(false);
  };

  const selected = doctors.find((d) => d.id === selectedId);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">График работы</h1>
      <p className="mt-1 text-sm text-muted-foreground">Настройте расписание для каждого врача</p>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="flex flex-row gap-2 overflow-x-auto pb-2 lg:flex-col lg:justify-between lg:overflow-visible lg:pb-0">
          {doctors.map((doc) => (
            <button
              key={doc.id}
              onClick={() => selectDoctor(doc)}
              className={`w-full shrink-0 rounded-xl px-4 py-3 text-left transition-all duration-200 lg:px-5 lg:py-5 ${
                selectedId === doc.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-foreground hover:bg-accent"
              }`}
            >
              <p className="text-lg font-semibold">{doc.name.split(" ").slice(0, 2).join(" ")}</p>
              <p className={`mt-1 text-sm ${selectedId === doc.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{doc.specialty}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">{selected.name}</h2>
              <p className="text-sm text-muted-foreground">{selected.specialty}</p>

              <div className="mt-6 space-y-3">
                {DAYS.map((day) => {
                  const s = schedule[day.key];
                  if (!s) return null;
                  return (
                    <div key={day.key} className={`flex items-center gap-4 rounded-xl px-4 py-4 transition-colors ${s.enabled ? "bg-green-50 dark:bg-green-950/30" : "bg-muted"}`}>
                      <button
                        onClick={() => toggleDay(day.key)}
                        className={`h-5 w-5 shrink-0 rounded border-2 transition-colors ${s.enabled ? "border-green-500 bg-green-500" : "border-muted-foreground/30 bg-card"}`}
                      >
                        {s.enabled && <svg className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </button>

                      <span className={`w-28 text-sm font-medium ${s.enabled ? "text-foreground" : "text-muted-foreground"}`}>{day.label}</span>

                      {s.enabled ? (
                        <div className="flex items-center gap-2">
                          <select value={s.start} onChange={(e) => updateTime(day.key, "start", e.target.value)}
                            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary">
                            {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                          </select>
                          <span className="text-muted-foreground">—</span>
                          <select value={s.end} onChange={(e) => updateTime(day.key, "end", e.target.value)}
                            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary">
                            {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Выходной</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <button onClick={save} disabled={saving}
                  className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50">
                  {saving ? "Сохранение..." : saved ? "Сохранено!" : "Сохранить график"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
