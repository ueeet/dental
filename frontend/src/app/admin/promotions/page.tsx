"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface Promotion {
  id: number;
  title: string;
  description: string | null;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
}

export default function AdminPromotions() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [editing, setEditing] = useState<Partial<Promotion> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".page-title", { y: -20, opacity: 0, duration: 0.5, ease: "power2.out" });
    gsap.from(".page-controls", { y: 20, opacity: 0, duration: 0.5, delay: 0.1, ease: "power2.out" });
    gsap.from(".page-content", { y: 30, opacity: 0, duration: 0.6, delay: 0.2, ease: "power3.out" });
  }, { scope: containerRef });

  const load = () => api.get<Promotion[]>("/promotions/all").then(setPromos);
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const { id, ...rest } = editing as Promotion & Record<string, unknown>;
    const body = { title: rest.title, description: rest.description, isActive: rest.isActive, startDate: rest.startDate, endDate: rest.endDate };
    try {
      if (id) {
        await api.put(`/promotions/${id}`, body);
      } else {
        await api.post("/promotions", body);
      }
      setEditing(null);
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Ошибка сохранения");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Удалить акцию?")) return;
    await api.delete(`/promotions/${id}`);
    load();
  };

  return (
    <div ref={containerRef}>
      <div className="page-controls flex items-center justify-between">
        <h1 className="page-title text-2xl font-bold text-foreground">Акции</h1>
        <button onClick={() => setEditing({ title: "", description: "", isActive: true })} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Добавить
        </button>
      </div>

      <div className="page-content mt-6 space-y-4">
        {promos.map((p) => (
          <div key={p.id} className="promo-card rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{p.title}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.isActive ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                    {p.isActive ? "Активна" : "Неактивна"}
                  </span>
                </div>
                {p.description && <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>}
                <p className="mt-2 text-xs text-muted-foreground/60">
                  {p.startDate && new Date(p.startDate).toLocaleDateString("ru-RU")}
                  {p.startDate && p.endDate && " — "}
                  {p.endDate && new Date(p.endDate).toLocaleDateString("ru-RU")}
                </p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(p)} className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/80">Ред.</button>
                <button onClick={() => remove(p.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900">Удалить</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onMouseDown={(e) => { if (e.target === e.currentTarget) setEditing(null); }}>
          <div className="w-full max-w-md rounded-2xl bg-card p-6">
            <h2 className="text-lg font-bold text-foreground">{editing.id ? "Редактирование" : "Новая акция"}</h2>
            <div className="mt-4 space-y-3">
              <input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="Заголовок" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
              <textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Описание" rows={3} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary" />
              <div className="flex gap-3">
                <input type="date" value={editing.startDate?.slice(0, 10) || ""} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
                <input type="date" value={editing.endDate?.slice(0, 10) || ""} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={editing.isActive ?? true} onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })} className="rounded" />
                Активна
              </label>
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={save} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">Сохранить</button>
              <button onClick={() => setEditing(null)} className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent/80">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
